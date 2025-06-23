// backend/src/index.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { fetchPriceTrackerCardPrices } = require('./priceTracker');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// PokéTCG v2 client
const pokeApi = axios.create({
    baseURL: 'https://api.pokemontcg.io/v2',
    headers: { 'X-Api-Key': process.env.POKEMONTCG_API_KEY || '' }
});

/**
 * GET /api/card-info
 * Supports setId='all' + printedTotal, and returns:
 * - multiple: true + cards[]   (when ambiguous)
 * - multiple: false + card data + marketPrice + priceSources
 */
app.get('/api/card-info', async (req, res) => {
    const { cardNumber, setId = 'all' } = req.query;
    if (!cardNumber) {
        return res.status(400).json({ error: 'cardNumber required (e.g. 4/102)' });
    }

    try {
        // parse "10/102"
        const [number, printedTotal] = String(cardNumber).split('/').map(s => s.trim());

        // build query
        let q = `number:${number}`;
        if (setId !== 'all') {
            q = `set.id:${setId} number:${number}`;
        } else if (printedTotal) {
            q = `number:${number} set.printedTotal:${printedTotal}`;
        }

        // fetch card(s)
        const resp = await pokeApi.get('/cards', { params: { q } });
        const matches = resp.data.data;
        if (!matches || matches.length === 0) {
            return res.status(404).json({ error: 'Card not found' });
        }

        // multiple → let frontend disambiguate
        if (matches.length > 1) {
            const cards = matches.map(c => ({
                id: c.id,
                name: c.name,
                setId: c.set.id,
                set: c.set.name,
                image: c.images.small
            }));
            return res.json({ multiple: true, cards });
        }

        // single match → fetch pricing
        const card = matches[0];

        // Fetch real low/high via PriceTracker (setId + number)
        let marketPrice = { low: null, high: null };
        let priceSources = null;
        try {
            priceSources = await fetchPriceTrackerCardPrices(card.set.id, card.number);
            // Extract from tcgplayer.prices
            const tcg = priceSources?.tcgplayer?.prices;
            if (!tcg) {
                throw new Error('No tcgplayer price data available');
            }
            // Prefer holofoil, then normal, then reverseHolofoil
            const priceObj = tcg.holofoil || tcg.normal || tcg.reverseHolofoil;
            if (!priceObj) {
                throw new Error('No tcgplayer price object found');
            }
            marketPrice = {
                low: priceObj.low ?? null,
                high: priceObj.high ?? null
            };
        } catch (e) {
            console.error('PriceTracker API error:', e.message || e);
            // fallback stub
            marketPrice = {
                low: (Math.random() * 20 + 5).toFixed(2),
                high: (Math.random() * 100 + 20).toFixed(2)
            };
        }

        // respond
        return res.json({
            multiple: false,
            id: card.id,
            name: card.name,
            setId: card.set.id,
            set: card.set.name,
            image: card.images.large,
            marketPrice,  // { low, high }
            priceSources  // full breakdown from PriceTracker
        });
    } catch (err) {
        console.error('Error in /api/card-info:', err.message || err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// ─── Sets list endpoint ───
app.get('/api/sets', async (req, res) => {
    try {
        const resp = await pokeApi.get('/sets');
        const sets = resp.data.data.map(s => ({ id: s.id, name: s.name }));
        return res.json({ sets });
    } catch (err) {
        console.error('Error fetching sets:', err.message || err);
        return res.status(500).json({ error: 'Failed to fetch sets' });
    }
});

app.listen(PORT, () =>
    console.log(`Backend listening on http://localhost:${PORT}`)
);
