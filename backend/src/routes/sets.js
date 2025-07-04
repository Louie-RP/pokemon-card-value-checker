const express = require('express');
const { fetchRecentSets } = require('../tcgplayer');
const axios = require('axios');
const POKEMONTCG_API_KEY = process.env.POKEMONTCG_API_KEY || '';
const pokeApi = axios.create({
    baseURL: 'https://api.pokemontcg.io/v2',
    headers: { 'X-Api-Key': POKEMONTCG_API_KEY }
});

/**
 * Create a router for set endpoints with optional Redis caching.
 * @param {import('redis').RedisClientType} redisClient
 * @param {number} ttlSeconds
 */
module.exports = function createSetsRouter(redisClient, ttlSeconds = 3600) {
    const router = express.Router();

    // GET /api/sets?all=true → return all sets for dropdown
    router.get('/', async (req, res) => {
        const isAll = req.query.all === 'true';
        const limit = parseInt(req.query.limit, 10) || 10;
        const cacheKey = isAll ? 'sets:all' : `sets:recent:${limit}`;

        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                return res.json(JSON.parse(cached));
            }

            if (isAll) {
                let allSets = [];
                let page = 1;
                const pageSize = 250;
                let totalCount = 0;
                do {
                    const resp = await pokeApi.get('/sets', {
                        params: { page, pageSize, orderBy: 'releaseDate' }
                    });
                    allSets = allSets.concat(resp.data.data);
                    totalCount = resp.data.totalCount;
                    page++;
                } while (allSets.length < totalCount);

                await redisClient.setEx(cacheKey, ttlSeconds, JSON.stringify(allSets));
                return res.json(allSets);
            }

            const sets = await fetchRecentSets(limit);
            await redisClient.setEx(cacheKey, ttlSeconds, JSON.stringify(sets));
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

    return router;
};
