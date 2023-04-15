(define-constant ERR_HTLC_NOT_FOUND u1001)
(define-constant ERR_INVALID_AMOUNT u1002)
(define-constant ERR_INVALID_RECIPIENT u1003)
(define-constant ERR_INVALID_HASH_LOCK u1004)
(define-constant ERR_INVALID_TIMEOUT u1005)
(define-constant ERR_HTLC_ALREADY_REDEEMED u1006)
(define-constant ERR_HTLC_EXPIRED u1007)
(define-constant ERR_INSUFFICIENT_BALANCE u1008)

(define-map htlcs
  { id: uint }
  {
    recipient: principal,
    amount: uint,
    hashlock: (buff 20),
    timeout: uint,
    token: (optional principal),
    redeemed: bool
  }
)

(define-public (create-htlc (id uint) (recipient principal) (hashlock (buff 20)) (amount uint) (timeout uint) (token (optional principal)))
  (let ((current-block-height (get-block-info? time time)))
    (asserts! (is-some current-block-height) (err ERR_INVALID_TIMEOUT))
    (asserts! (> timeout (unwrap-panic current-block-height)) (err ERR_INVALID_TIMEOUT))
    (asserts! (is-none (map-get? htlcs { id: id })) (err ERR_HTLC_ALREADY_REDEEMED))
    (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
    (match token
      (some token-contract)
      (begin
        (asserts! (ft-transfer? token-contract amount tx-sender recipient) (err ERR_INSUFFICIENT_BALANCE))
        (map-set htlcs
          { id: id }
          {
            recipient: recipient,
            amount: amount,
            hashlock: hashlock,
            timeout: timeout,
            token: token,
            redeemed: false
          }
        )
        (ok id)
      )
      (begin
        (asserts! (stx-transfer? amount tx-sender recipient) (err ERR_INSUFFICIENT_BALANCE))
        (map-set htlcs
          { id: id }
          {
            recipient: recipient,
            amount: amount,
            hashlock: hashlock,
            timeout: timeout,
            token: none,
            redeemed: false
          }
        )
        (ok id)
      )
    )
  )
)

(define-public (redeem-htlc (id uint) (preimage (buff 20)))
  (let ((htlc (unwrap! (map-get? htlcs { id: id }) (err ERR_HTLC_NOT_FOUND)))
        (hashlock (hash160 preimage)))
    (asserts! (not (get redeemed htlc)) (err ERR_HTLC_ALREADY_REDEEMED))
    (asserts! (is-eq hashlock (get hashlock htlc)) (err ERR_INVALID_HASH_LOCK))
    (map-set htlcs
      { id: id }
      (merge htlc { redeemed: true })
    )
    (ok (get amount htlc))
  )
)

(define-public (refund-htlc (id uint))
  (let ((htlc (unwrap! (map-get? htlcs { id: id }) (err ERR_HTLC_NOT_FOUND)))
        (current-block-height (get-block-info? time time)))
        (asserts! (not (get redeemed htlc)) (err ERR_HTLC_ALREADY_REDEEMED))
        (asserts! (is-some current-block-height) (err ERR_INVALID_TIMEOUT))
        (asserts! (>= (unwrap-panic current-block-height) (get timeout htlc)) (err ERR_HTLC_EXPIRED))
        (match (get token htlc)
            (some token-contract)
            (begin
                (asserts! (ft-transfer? token-contract (get amount htlc) tx-sender (get recipient htlc)) (err ERR_INSUFFICIENT_BALANCE))
                (map-set htlcs
                    { id: id }
                    (merge htlc { redeemed: true })
                )
                (ok (get amount htlc))
            )
            (begin
                (asserts! (stx-transfer? (get amount htlc) tx-sender (get recipient htlc)) (err ERR_INSUFFICIENT_BALANCE))
                (map-set htlcs
                    { id: id }
                    (merge htlc { redeemed: true })
                )
                (ok (get amount htlc))
            )
        )
    )
)