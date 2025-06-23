// backend/src/priceTracker.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const axios = require('axios');

const BASE_URL = 'https://www.pokemonpricetracker.com/api/v1';
const API_KEY = process.env.PRICE_TRACKER_API_KEY;

if (!API_KEY) {
    console.warn('⚠️  PRICE_TRACKER_API_KEY not set in .env');
}

/**
 * Fetch full card pricing entry via setId + number
 * @param {string} setId    e.g. 'sv10'
 * @param {string} number   e.g. '131'
 * @returns {Promise<object>} entire entry including .tcgplayer and .cardmarket
 */
async function fetchPriceTrackerCardPrices(setId, number) {
    const resp = await axios.get(`${BASE_URL}/prices`, {
        params: { setId, number },
        headers: { Authorization: `Bearer ${API_KEY}` }
    });

    const entry = (resp.data.data || [])[0];
    console.log('PriceTracker API entry:', entry);
    if (!entry) {
        throw new Error(`PriceTracker: no data for ${setId}-${number}`);
    }

    // return the full entry so caller can pick from .tcgplayer.prices, .cardmarket.prices, etc.
    return entry;
}

module.exports = { fetchPriceTrackerCardPrices };
