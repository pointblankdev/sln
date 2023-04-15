const {
  makeContractCall,
  makeSTXTokenTransfer,
  broadcastTransaction,
  privateKeyToString,
} = require("@stacks/transactions");
const { StacksTestnet } = require("@stacks/network");

// Load private key and network configuration
const privateKey = "your-private-key-here";
const network = new StacksTestnet();
const contractAddress = "your-contract-address-here";
const contractName = "your-contract-name-here";
const sbtcTokenAddress = "your-sbtc-token-contract-address-here";

async function createHTLC(id, recipient, hash, amount, timeout, tokenContractAddress) {
  const txOptions = {
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: "create-htlc",
    functionArgs: [
      { type: "uint", value: id },
      { type: "principal", value: recipient },
      { type: "buff", value: hash },
      { type: "uint", value: amount },
      { type: "uint", value: timeout },
      tokenContractAddress
        ? { type: "some", value: { type: "principal", value: tokenContractAddress } }
        : { type: "none" },
    ],
    senderKey: privateKeyToString(privateKey),
    network: network,
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  return result;
}

async function fundChannel(amount) {
  const txOptions = makeSTXTokenTransfer({
    recipient: contractAddress,
    amount: amount,
    senderKey: privateKeyToString(privateKey),
    network: network,
    memo: "Fund HTLC Channel",
  });

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  return result;
}

async function redeemHTLC(id, preimage) {
  const txOptions = {
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: "redeem-htlc",
    functionArgs: [id, preimage],
    senderKey: privateKeyToString(privateKey),
    network: network,
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  return result;
}

async function refundHTLC(id) {
  const txOptions = {
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: "refund-htlc",
    functionArgs: [id],
    senderKey: privateKeyToString(privateKey),
    network: network,
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  return result;
}

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
