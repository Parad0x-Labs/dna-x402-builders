# Run Agent On Android Phone

Use an old Android phone as a Telegram agent server with Termux.

## Install

Install Termux, then run:

```bash
pkg update -y
pkg install -y nodejs git
git clone https://github.com/Parad0x-Labs/dna-x402-builders
cd dna-x402-builders/launchers/telegram
cp .env.example .env
npm install
npm run start
```

Edit `.env` with your agent ID and BotFather token.

## Notes

- keep the phone online
- disable aggressive battery sleep for Termux
- keep the token local
- do not store wallet private keys on the bot

