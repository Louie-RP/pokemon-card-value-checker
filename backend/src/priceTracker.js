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
 * Fetch pricing for a single card via setId + number
 * @param {string} setId    // e.g. 'base1'
 * @param {string} number   // e.g. '4'
 */
async function fetchPriceTrackerCardPrices(setId, number) {
    const resp = await axios.get(`${BASE_URL}/prices`, {
        params: { setId, number },
        headers: { Authorization: `Bearer ${API_KEY}` }
    });

    // resp.data.data is an array of matches; take the first
    const entry = (resp.data.data || [])[0];
    console.log('PriceTracker API entry:', entry); // Add this line
    if (!entry) {
        throw new Error(`PriceTracker: no data for ${setId}-${number}`);
    }

    return entry.prices;  // { tcgplayer: { lowPrice, highPrice }, … }
}

module.exports = { fetchPriceTrackerCardPrices };
