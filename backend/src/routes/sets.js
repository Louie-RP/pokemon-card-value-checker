const express = require('express');
const router = express.Router();
const { fetchRecentSets } = require('../tcgplayer');

const axios = require('axios');
const POKEMONTCG_API_KEY = process.env.POKEMONTCG_API_KEY || '';
const pokeApi = axios.create({
    baseURL: 'https://api.pokemontcg.io/v2',
    headers: { 'X-Api-Key': POKEMONTCG_API_KEY }
});

// GET /api/sets?all=true → return all sets for dropdown
router.get('/', async (req, res) => {
    try {
        if (req.query.all === 'true') {
            // Fetch all sets for dropdown
            let allSets = [];
            let page = 1;
            let pageSize = 250;
            let totalCount = 0;
            do {
                const resp = await pokeApi.get('/sets', {
                    params: { page, pageSize, orderBy: 'releaseDate' }
                });
                allSets = allSets.concat(resp.data.data);
                totalCount = resp.data.totalCount;
                page++;
            } while (allSets.length < totalCount);
            return res.json(allSets);
        }

        // Default: recent sets for banner
        const limit = parseInt(req.query.limit, 10) || 10;
        const sets = await fetchRecentSets(limit);
        res.json(sets);
    } catch (error) {
        if (error.response) {
            console.error('Failed to fetch sets:', error.response.data);
        } else {
            console.error('Failed to fetch sets:', error.message || error);
        }
        res.status(500).json({ error: 'Failed to fetch sets' });
    }
});

module.exports = router;