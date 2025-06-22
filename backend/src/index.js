require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/card-info', async (req, res) => {
    const { cardNumber } = req.query;
    if (!cardNumber) return res.status(400).json({ error: 'cardNumber required (e.g. 4/102)' });

    try {
        // For this prototype, we assume Base Set (ID = base1)
        const [num] = cardNumber.split('/');
        const setId = 'base1';

        const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
            headers: { 'X-Api-Key': process.env.POKEMONTCG_API_KEY || '' },
            params: { q: `set.id:${setId} number:${num}` }
        });

        const card = response.data.data[0];
        if (!card) return res.status(404).json({ error: 'Card not found' });

        // 🚧 Stubbed pricing—replace with real-API logic later
        const marketPrice = {
            low: (Math.random() * 20 + 5).toFixed(2),
            high: (Math.random() * 100 + 20).toFixed(2)
        };

        res.json({
            name: card.name,
            image: card.images.large,
            marketPrice
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
