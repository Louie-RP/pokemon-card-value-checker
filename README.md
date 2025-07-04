# pokemon-card-value-checker
App checks the value of Pokemon Cards

## Backend Environment Variables

- `POKEMONTCG_API_KEY` – optional key for the PokéTCG API
- `PORT` – backend port (default `4000`)
- `REDIS_URL` – Redis connection string used for caching (e.g. `redis://localhost:6379`)

Card and set responses are cached in Redis for about one hour.
