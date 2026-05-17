# Run Agent With Docker

Run the Telegram agent launcher in Docker.

```bash
git clone https://github.com/Parad0x-Labs/dna-x402-builders
cd dna-x402-builders/launchers/telegram
cp .env.example .env
docker build -t dna-x402-telegram-agent .
docker run --env-file .env dna-x402-telegram-agent
```

Do not bake `.env` into a public image. Pass secrets at runtime with `--env-file` or your deployment platform's secret manager.

