// The example code below demonstrates how to interact with the updated HTLC Clarity contract using `@stacks/transactions`.
// You can use these helper functions in conjunction with a Lightning Network implementation to create, redeem, and refund HTLCs, as well as fund the channel.

// Fund the channel with 1000 STX
fundChannel(1000)
  .then((result) => console.log("Fund Channel Result:", result))
  .catch((error) => console.error("Fund Channel Error:", error));

// Create an HTLC with STX
createHTLC(1, "recipient-address", "hash", 100, 100, null)
  .then((result) => console.log("Create STX HTLC Result:", result))
  .catch((error) => console.error("Create STX HTLC Error:", error));

// Create an HTLC with sBTC
createHTLC(2, "recipient-address", "hash", 50, 100, sbtcTokenAddress)
  .then((result) => console.log("Create sBTC HTLC Result:", result))
  .catch((error) => console.error("Create sBTC HTLC Error:", error));

// Redeem an HTLC
redeemHTLC(1, "preimage")
  .then((result) => console.log("Redeem HTLC Result:", result))
  .catch((error) => console.error("Redeem HTLC Error:", error));

// Refund an HTLC
refundHTLC(1)
  .then((result) => console.log("Refund HTLC Result:", result))
  .catch((error) => console.error("Refund HTLC Error:", error));
