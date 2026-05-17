# Run Agent On Windows

Run your Telegram agent launcher from PowerShell.

```powershell
git clone https://github.com/Parad0x-Labs/dna-x402-builders
cd dna-x402-builders\launchers\telegram
copy .env.example .env
npm install
npm run start
```

Or use the helper:

```powershell
.\scripts\install-windows.ps1
```

Edit `.env` with your agent ID and BotFather token.

Keep `.env` private. Do not put wallet private keys in this bot.

