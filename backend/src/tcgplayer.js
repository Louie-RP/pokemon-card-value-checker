// tcgplayer.js
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
    if (!card?.tcgplayer?.prices?.holofoil) {
        return null;
    }
    const holofoil = card.tcgplayer.prices.holofoil;
    return {
        low: holofoil.low ?? null,
        mid: holofoil.mid ?? null,
        high: holofoil.high ?? null,
        market: holofoil.market ?? null,
        directLow: holofoil.directLow ?? null
    };
}

/**
 * Fetch the N most recent released sets.
 * Uses the set releaseDate to only return those <= today,
 * ordered newest first.
 */
async function fetchRecentSets(limit = 10) {
    const today = new Date();
    const thisYear = today.getFullYear();

    let resp;
    try {
        resp = await pokeApi.get('/sets', {
            params: {
                orderBy: '-releaseDate',
                pageSize: 50 // Get enough sets to filter from
            }
        });
    } catch (error) {
        console.error('PokéTCG API error:', error.response?.data || error.message || error);
        throw error;
    }

    // Log the raw API response for debugging
    console.log('PokéTCG API /sets response:', JSON.stringify(resp.data, null, 2));

    let sets = resp.data.data;

    // Only filter out sets with no releaseDate (keep both past and future sets)
    sets = sets.filter(set => !!set.releaseDate);

    // Already sorted by releaseDate descending, just limit
    return sets.slice(0, limit);
}

/**
 * Fetch the N upcoming sets (releaseDate > today), sorted soonest first.
 */
async function fetchUpcomingSets(limit = 5) {
    const today = new Date().toISOString().split('T')[0];
    const resp = await pokeApi.get('/sets', {
        params: {
            orderBy: 'releaseDate',
            q: `releaseDate:[${today}..]`
        }
    });
    return resp.data.data.slice(0, limit);
}

module.exports = {
    fetchTCGPlayerHolofoilPrices,
    fetchRecentSets,
    fetchUpcomingSets
};
