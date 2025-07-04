const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('redis');
const { fetchPriceTrackerCardPrices } = require('./priceTracker');
const { fetchTCGPlayerHolofoilPrices } = require('./tcgplayer');
const createSetsRouter = require('./routes/sets');

const app = express();
const PORT = process.env.PORT || 4000;

// Redis client for caching
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on('error', err => console.error('Redis error:', err));
redisClient.connect().catch(err => console.error('Redis connection error:', err));

const CACHE_TTL = 3600; // seconds

app.use(cors());
app.use(express.json());

// PokéTCG v2 client
const pokeApi = axios.create({
    baseURL: 'https://api.pokemontcg.io/v2',
    headers: { 'X-Api-Key': process.env.POKEMONTCG_API_KEY || '' }
});

app.get('/api/card-info', async (req, res) => {
    const { cardNumber, setId = 'all' } = req.query;
    if (!cardNumber) return res.status(400).json({ error: 'cardNumber required (e.g. 4/102)' });

    const cacheKey = `card-info:${setId}:${cardNumber}`;
    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }
    } catch (err) {
        console.error('Redis get error:', err);
    }

    try {
        const [number, printedTotal] = String(cardNumber).split('/').map(s => s.trim());
        let q = `number:${number}`;
        if (setId !== 'all') q = `set.id:${setId} number:${number}`;
        else if (printedTotal) q = `number:${number} set.printedTotal:${printedTotal}`;

        const resp = await pokeApi.get('/cards', { params: { q } });
        const matches = resp.data.data;
        if (!matches?.length) return res.status(404).json({ error: 'Card not found' });

        if (matches.length > 1) {
            const cards = matches.map(c => ({
                id: c.id,
                name: c.name,
                setId: c.set.id,
                set: c.set.name,
                image: c.images.small
            }));
            const data = { multiple: true, cards };
            await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(data));
            return res.json(data);
        }

        // Single match → fetch eBay pricing
        const card = matches[0];
        let marketPrice = null;
        let ebay = null;

        // Fetch TCGPlayer holofoil prices
        let tcgplayerPrice = null;
        try {
            tcgplayerPrice = await fetchTCGPlayerHolofoilPrices(card.id);
        } catch (err) {
            console.error('Error fetching TCGPlayer price:', err.message || err);
        }

        try {
            const entry = await fetchPriceTrackerCardPrices(card.set.id, card.number);

            // Debug: log the tcgplayer section from the API response
            console.log('PokePriceTracker API tcgplayer:', JSON.stringify(entry.tcgplayer, null, 2));

            ebay = entry.ebay || {};
            const pricesByGrade = ebay.prices || {};

            // Normalize keys (support both "8" and "PSA 8")
            function getGradeStats(prices, grade) {
                return (
                    prices[`PSA ${grade}`]?.stats?.average ??
                    prices[`${grade}`]?.stats?.average ??
                    null
                );
            }
            function getGradeCount(prices, grade) {
                return (
                    prices[`PSA ${grade}`]?.stats?.count ??
                    prices[`${grade}`]?.stats?.count ??
                    null
                );
            }

            const ebayPSAPrices = {
                "8": {
                    average: getGradeStats(pricesByGrade, 8),
                    count: getGradeCount(pricesByGrade, 8),
                },
                "9": {
                    average: getGradeStats(pricesByGrade, 9),
                    count: getGradeCount(pricesByGrade, 9),
                },
                "10": {
                    average: getGradeStats(pricesByGrade, 10),
                    count: getGradeCount(pricesByGrade, 10),
                },
            };

            const cardmarket = entry.cardmarket?.prices || null;
            const ptcgTcgplayer = entry.tcgplayer?.prices?.holofoil || null;
            const priceTrackerTCGPlayer = ptcgTcgplayer
                ? {
                    lowPrice: ptcgTcgplayer.low ?? null,
                    midPrice: ptcgTcgplayer.mid ?? null,
                    highPrice: ptcgTcgplayer.high ?? null,
                    marketPrice: ptcgTcgplayer.market ?? null,
                    directLowPrice: ptcgTcgplayer.directLow ?? null,
                }
                : null;

            const data = {
                multiple: false,
                id: card.id,
                name: card.name,
                setId: card.set.id,
                set: card.set.name,
                image: card.images.large,
                marketPrice,
                ebay,
                tcgplayerPrice,
                cardmarket, // add this
                priceTrackerTCGPlayer, // add this
                ebayPSAPrices,
            };
            await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(data));
            return res.json(data);
        } catch (err) {
            console.error('Error fetching eBay data:', err.message || err);
            marketPrice = {
                low: (Math.random() * 20 + 5).toFixed(2),
                high: (Math.random() * 100 + 20).toFixed(2)
            };
        }

        const data = {
            multiple: false,
            id: card.id,
            name: card.name,
            setId: card.set.id,
            set: card.set.name,
            image: card.images.large,
            marketPrice,
            ebay,
            tcgplayerPrice
        };
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(data));
        return res.json(data);
    } catch (err) {
        console.error('Server error:', err.message || err);
        return res.status(500).json({ error: 'Server error' });
    }
});

const setsRouter = createSetsRouter(redisClient, CACHE_TTL);
app.use('/api/sets', setsRouter);

app.listen(PORT, () =>
    console.log(`Backend listening on http://localhost:${PORT}`)
);
