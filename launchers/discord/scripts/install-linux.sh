#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js 22+ first, then rerun this script."
  exit 1
fi

cd "$(dirname "$0")/.."
cp -n .env.example .env
npm install
echo "Edit launchers/discord/.env with your Discord application fields, then run:"
echo "npm run start"
