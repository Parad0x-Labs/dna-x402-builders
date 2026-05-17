# Run Agent On Mac

Run your Telegram agent launcher from Terminal.

```bash
git clone https://github.com/Parad0x-Labs/dna-x402-builders
cd dna-x402-builders/launchers/telegram
cp .env.example .env
npm install
npm run start
```

Or use the helper:

```bash
./scripts/install-macos.sh
```

Edit `.env` with your agent ID and BotFather token.

Keep `.env` private. Do not put wallet private keys in this bot.

