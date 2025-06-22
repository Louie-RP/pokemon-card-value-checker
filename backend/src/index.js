// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// PokéTCG v2 client
const pokeApi = axios.create({
    baseURL: 'https://api.pokemontcg.io/v2',
    headers: { 'X-Api-Key': process.env.POKEMONTCG_API_KEY || '' }
});

// ─── Card lookup endpoint with “All Sets + printedTotal” support ───
app.get('/api/card-info', async (req, res) => {
    const { cardNumber, setId = 'all' } = req.query;
    if (!cardNumber) {
        return res
            .status(400)
            .json({ error: 'cardNumber required (e.g. 4/102)' });
    }

    try {
        // split “10/102” → [“10”, “102”]
        const [number, printedTotal] = String(cardNumber).split('/').map(s => s.trim());

        // Build the query:
        // - If setId !== 'all', filter by set.id + number
        // - If setId === 'all' AND printedTotal provided, filter by number + printedTotal
        // - Otherwise (setId==='all' with no slash) just filter by number
        let q = `number:${number}`;
        if (setId !== 'all') {
            q = `set.id:${setId} number:${number}`;
        } else if (printedTotal) {
            q = `number:${number} set.printedTotal:${printedTotal}`;
        }

        const resp = await pokeApi.get('/cards', { params: { q } });
        const matches = resp.data.data;

        if (!matches || matches.length === 0) {
            return res.status(404).json({ error: 'Card not found' });
        }

        // If multiple, return list for front-end to disambiguate
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

        // Exactly one match
        const card = matches[0];
        const marketPrice = {
            low: (Math.random() * 20 + 5).toFixed(2),
            high: (Math.random() * 100 + 20).toFixed(2)
        };

        return res.json({
            multiple: false,
            id: card.id,
            name: card.name,
            setId: card.set.id,
            set: card.set.name,
            image: card.images.large,
            marketPrice
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
