(define-constant ERR_CHANNEL_ALREADY_EXISTS u2001)
(define-constant ERR_CHANNEL_NOT_FOUND u2002)

(define-map channels
  { channel-id: uint }
  {
    sender: principal,
    recipient: principal,
    balance-sender: uint,
    balance-recipient: uint,
    token: (optional principal)
  }
)

(define-public (fund-channel (channel-id uint) (recipient principal) (amount uint) (token (optional principal)))
  (asserts! (is-none (map-get? channels { channel-id: channel-id })) (err ERR_CHANNEL_ALREADY_EXISTS))
  (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
  (match token
    (some token-contract)
    (begin
      (asserts! (ft-transfer? token-contract amount tx-sender recipient) (err ERR_INSUFFICIENT_BALANCE))
      (map-set channels
        { channel-id: channel-id }
        {
          sender: tx-sender,
          recipient: recipient,
          balance-sender: amount,
          balance-recipient: u0,
          token: token
        }
      )
      (ok channel-id)
    )
    (begin
      (asserts! (stx-transfer? amount tx-sender recipient) (err ERR_INSUFFICIENT_BALANCE))
      (map-set channels
        { channel-id: channel-id }
        {
          sender: tx-sender,
          recipient: recipient,
          balance-sender: amount,
          balance-recipient: u0,
          token: none
        }
      )
      (ok channel-id)
    )
  )
)