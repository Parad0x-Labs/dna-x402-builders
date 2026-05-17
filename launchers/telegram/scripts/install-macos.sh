#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js 22+ first. Homebrew users can run: brew install node"
  exit 1
fi

cd "$(dirname "$0")/.."
cp -n .env.example .env
npm install
echo "Edit launchers/telegram/.env with your BotFather token, then run:"
echo "npm run start"

