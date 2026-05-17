#!/usr/bin/env bash
set -euo pipefail

pkg update -y
pkg install -y nodejs git

cd "$(dirname "$0")/.."
cp -n .env.example .env
npm install
echo "Edit launchers/telegram/.env with your BotFather token, then run:"
echo "npm run start"

