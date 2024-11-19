// near-js imports
// https://www.npmjs.com/package/@near-js/client
const { nearConnect } = require('../utils/connect');
const { getHermesPriceData } = require('../utils/fetch-hermes-price-data');
const { functionCall } = require('@near-js/client');

const sender = 'your-account.testnet';
const receiver = 'pyth-oracle.testnet';
const network = 'testnet';

const PRICE_IDS = [
  // Price ids can be found at https://www.pyth.network/developers/price-feed-ids#near-testnet
  // NOTE: Ensure you are using NEAR specific price ids & remove the '0x' prefix before using them
  'f9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b', // BTC/USD price id
  'ca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6', // ETH/USD price id
];

async function updatePythContractPriceFeeds(network) {
  // Connect to the NEAR network
  const { rpcProvider, signer } = nearConnect(sender, network);
  // subtract 500ms to account for network latency
  const publishTime = Math.floor((Date.now() - 500) / 1000); 
  // Get the price data from the Hermes API
  // See /utils/fetch-hermes-price-data.js for more details
  const hermesData = await getHermesPriceData( PRICE_IDS[0], publishTime, network);
  console.log(hermesData);
  
  // Update the Pyth Oracle contract with the price data
  // Performs a NEAR function call to the Pyth Oracle contract
  const result = await functionCall({
    sender,
    receiver,
    method: 'update_price_feeds',
    args: { data: hermesData },
    deposit: 100000000000000000000000,
    deps: { rpcProvider, signer },
  });

  console.log(
    `Transaction 👉 https://testnet.nearblocks.io/txns/${result.outcome.transaction.hash}`
  );
  return result;
}

updatePythContractPriceFeeds(network);
