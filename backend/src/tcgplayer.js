const axios = require('axios');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const POKEMONTCG_API_KEY = process.env.POKEMONTCG_API_KEY || '';
const pokeApi = axios.create({
    baseURL: 'https://api.pokemontcg.io/v2',
    headers: { 'X-Api-Key': POKEMONTCG_API_KEY }
});

/**
 * Fetch TCGPlayer holofoil prices for a card by cardId.
 * Returns { low, mid, high, market, directLow } or null if not found.
 */
async function fetchTCGPlayerHolofoilPrices(cardId) {
    const resp = await pokeApi.get(`/cards/${cardId}`);
    const card = resp.data.data;
    if (!card || !card.tcgplayer || !card.tcgplayer.prices || !card.tcgplayer.prices.holofoil) {
        return null;
    }
    const holofoil = card.tcgplayer.prices.holofoil;
    // Return only the desired fields
    return {
        low: holofoil.low ?? null,
        mid: holofoil.mid ?? null,
        high: holofoil.high ?? null,
        market: holofoil.market ?? null,
        directLow: holofoil.directLow ?? null
    };
}

module.exports = { fetchTCGPlayerHolofoilPrices };