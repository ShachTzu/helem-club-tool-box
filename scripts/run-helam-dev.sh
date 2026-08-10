#!/bin/bash
# Loads .env (gitignored, holds MONGO_URL/CLOUDINARY_URL) into the process
# environment and starts the real "helam" app. Kept as a tiny wrapper so no
# secret value ever needs to be echoed, printed, or pasted into a chat.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "no .env file found - see docs/knowledge-library-handoff.md for what's needed" >&2
  exit 1
fi

# parsed as plain data, not sourced as shell code - a connection string can
# contain &, ?, = etc. that `source` would misinterpret as shell syntax.
while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in
    ''|'#'*) continue ;;
  esac
  key="${line%%=*}"
  value="${line#*=}"
  export "$key=$value"
done < .env

export CI=true
exec bit run helam --port 3000 --no-browser
