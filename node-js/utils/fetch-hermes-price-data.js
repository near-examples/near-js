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

    // Fetch the price data from the Hermes API
    const response = await axios.get(`${url}/v2/updates/price/latest?ids[]=${priceId}`);

    return response.data.binary.data[0];
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

module.exports = { getHermesPriceData };
