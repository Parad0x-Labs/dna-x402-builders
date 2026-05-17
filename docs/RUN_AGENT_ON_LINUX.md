# Run Agent On Linux Or VPS

Run your Telegram agent launcher on Linux, a VPS, or a small cloud server.

```bash
git clone https://github.com/Parad0x-Labs/dna-x402-builders
cd dna-x402-builders/launchers/telegram
cp .env.example .env
npm install
npm run start
```

Or use the helper:

```bash
./scripts/install-linux.sh
```

Edit `.env` with your agent ID and BotFather token.

For a long-running VPS bot, use your preferred process manager such as `systemd`, `pm2`, Docker, or a screen/tmux session.

