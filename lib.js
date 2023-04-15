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

/**
 * Creates an HTLC contract call.
 *
 * @param {number} id - The HTLC ID.
 * @param {string} recipient - The recipient of the HTLC.
 * @param {string} hash - The hash of the HTLC.
 * @param {number} amount - The amount of tokens locked in the HTLC.
 * @param {number} timeout - The timeout in blocks.
 * @param {string|null} [tokenContractAddress=null] - The contract address of the token, if any.
 *
 * @returns {Promise<string>} - A Promise that resolves to the transaction ID of the contract call.
 */
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

/**
 * Funds the HTLC channel with STX.
 *
 * @param {number} amount - The amount of STX to fund the channel with.
 *
 * @returns {Promise<string>} - A Promise that resolves to the transaction ID of the STX transfer.
 */
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

/**
 * Redeems an HTLC.
 *
 * @param {number} id - The HTLC ID.
 * @param {string} preimage - The preimage to use for redemption.
 *
 * @returns {Promise<string>} - A Promise that resolves to the transaction ID of the contract call.
 */
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

/**
 * Refunds an expired HTLC.
 *
 * @param {number} id - The HTLC ID.
 *
 * @returns {Promise<string>} - A Promise that resolves to the transaction ID of the contract call.
 */
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
