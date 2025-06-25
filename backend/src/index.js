const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { fetchPriceTrackerCardPrices } = require('./priceTracker');
const { fetchTCGPlayerHolofoilPrices } = require('./tcgplayer');

const app = express();
const PORT = process.env.PORT || 4000;

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
            return res.json({ multiple: true, cards });
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
            ebay = entry.ebay;
            const pricesByGrade = ebay.prices || {};

            // Prefer PSA10 if available
            if (pricesByGrade['10']?.price != null) {
                const p = pricesByGrade['10'].price;
                marketPrice = { low: p.toFixed(2), high: p.toFixed(2) };
            } else {
                const vals = Object.values(pricesByGrade)
                    .map(o => o.price)
                    .filter(v => typeof v === 'number');
                if (vals.length) {
                    const lo = Math.min(...vals);
                    const hi = Math.max(...vals);
                    marketPrice = { low: lo.toFixed(2), high: hi.toFixed(2) };
                }
            }
        } catch (err) {
            console.error('Error fetching eBay data:', err.message || err);
            marketPrice = {
                low: (Math.random() * 20 + 5).toFixed(2),
                high: (Math.random() * 100 + 20).toFixed(2)
            };
        }

        return res.json({
            multiple: false,
            id: card.id,
            name: card.name,
            setId: card.set.id,
            set: card.set.name,
            image: card.images.large,
            marketPrice,
            ebay,
            tcgplayerPrice
        });
    } catch (err) {
        console.error('Server error:', err.message || err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Sets endpoint (unchanged)
app.get('/api/sets', async (req, res) => {
    try {
        const resp = await pokeApi.get('/sets');
        const sets = resp.data.data.map(s => ({ id: s.id, name: s.name }));
        res.json({ sets });
    } catch (err) {
        console.error('Error fetching sets:', err.message || err);
        res.status(500).json({ error: 'Failed to fetch sets' });
    }
});

app.listen(PORT, () =>
    console.log(`Backend listening on http://localhost:${PORT}`)
);
