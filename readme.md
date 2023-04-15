# Documentation

## Channel Management Functions

The code defines a public function for managing payment channels between two parties on the Stacks blockchain:

`fund-channel`: This function creates and funds a payment channel between two parties and stores the details of the channel in a map called channels. It takes four parameters: `channel-id` (an identifier for the channel), `recipient` (the address of the recipient), `amount` (the initial amount of STX or fungible token to be transferred), and `token` (an optional fungible token address). This function performs several assertions to ensure that the inputs are valid and that the transaction is authorized. If successful, the function returns the `channel-id`.

The code also defines two error constants that are used by the assertions in the functions to indicate various error conditions, such as a channel that already exists or cannot be found.

Finally, the code declares a map called `channels` that stores the details of the payment channels created using the `fund-channel` function. The map includes the `channel-id`, `sender`, `recipient`, `balance-sender`, `balance-recipient`, and `token` for each channel. The balance-sender and balance-recipient fields track the current balance of the channel for each party.

## Hashed Time-Locked Contract (HTLC) Functions

The code defines three public functions for a Hashed Time-Locked Contract (HTLC) that enables secure and trustless transactions between parties on the Stacks blockchain:

`create-htlc`: This function creates a new HTLC and stores its details in a map called `htlcs`. It takes six parameters: `id` (an identifier for the HTLC), `recipient` (the address of the recipient), `hashlock` (a hash value), `amount` (the amount of STX or fungible token to be transferred), `timeout` (the expiry time for the HTLC), and `token` (an optional fungible token address). This function performs several assertions to ensure that the inputs are valid and that the transaction is authorized. If successful, the function returns the `id` of the HTLC.

`redeem-htlc`: This function allows the recipient of an HTLC to redeem the funds by providing the preimage that matches the hashlock. It takes two parameters: `id` (the identifier of the HTLC) and `preimage` (the preimage that matches the hashlock). This function verifies that the preimage matches the hashlock and that the HTLC has not already been redeemed. If successful, the function returns the amount of STX or fungible token to be transferred.

`refund-htlc`: This function allows the sender of an HTLC to reclaim the funds if the HTLC expires before it is redeemed. It takes one parameter: `id` (the identifier of the HTLC). This function checks if the HTLC has expired and if it has not already been redeemed. If the HTLC is valid, it transfers the funds back to the sender's account and marks the HTLC as redeemed. The function returns the amount of STX or fungible token to be refunded.

The code also defines eight error constants that are used by the assertions in the functions to indicate various error conditions, such as an invalid amount or recipient, an expired HTLC, or insufficient balance. Finally, the code declares a map called `htlcs` that stores the details of the HTLCs created using the `create-htlc` function.
