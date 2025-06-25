const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const axios = require('axios');

const BASE_URL = 'https://www.pokemonpricetracker.com/api/v1';
const API_KEY = process.env.PRICE_TRACKER_API_KEY;
if (!API_KEY) console.warn('⚠️ PRICE_TRACKER_API_KEY not set');

/**
 * Fetch full PriceTracker entry (including ebay) via setId & number.
 */
async function fetchPriceTrackerCardPrices(setId, number) {
    const resp = await axios.get(`${BASE_URL}/prices`, {
        params: { setId, number },
        headers: { Authorization: `Bearer ${API_KEY}` }
    });
    const entry = (resp.data.data || [])[0];
    if (!entry) throw new Error(`No data for ${setId}-${number}`);
    return entry;
}

module.exports = { fetchPriceTrackerCardPrices };
