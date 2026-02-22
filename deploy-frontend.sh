#!/usr/bin/env bash
set -euo pipefail

HOST="root@shortbox.de"
REMOTE_BASE="/var/www/shortbox/frontend"
TS="$(date +%Y%m%d%H%M%S)"
REMOTE_REL="$REMOTE_BASE/releases/$TS"

npm run build

# Vite output is usually dist/
if [[ ! -f "dist/index.html" ]]; then
  echo "ERROR: dist/index.html not found. Is your Vite build output 'dist'?"
  exit 1
fi

ssh "$HOST" "mkdir -p '$REMOTE_REL'"
rsync -av --delete dist/ "$HOST:$REMOTE_REL/"

ssh "$HOST" "shortbox-activate-frontend '$TS'"

echo "✅ Done. Frontend deployed as $TS"
