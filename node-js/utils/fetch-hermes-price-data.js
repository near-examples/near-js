const axios = require('axios');

// There are separate endpoints for testnet and mainnet
const HERMES_TESTNET_URL = 'https://hermes-beta.pyth.network';
const HERMES_MAINNET_URL = 'https://hermes.pyth.network';

async function getHermesPriceData(priceId, network) {
  try {
    let url;
    network === 'testnet'
      ? (url = HERMES_TESTNET_URL)
      : (url = HERMES_MAINNET_URL);

    // Get the current time and subtract 500ms to account for network latency
    const publishTime = Math.floor((Date.now() - 500) / 1000);

    // Fetch the price data from the Hermes API
    const response = await axios.get(`${url}/api/get_vaa?id=${priceId}&publish_time=${publishTime}`);

    // NEAR requires data in hex format
    const base64toHex = Buffer.from(response.data.vaa, 'base64').toString('hex');
    return base64toHex;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

module.exports = { getHermesPriceData };
