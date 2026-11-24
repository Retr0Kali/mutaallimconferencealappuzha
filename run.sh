#!/usr/bin/env bash
# SSF Muta'allim Conference - one-command setup & run
set -e
cd "$(dirname "$0")"

# 1. Node check
if ! command -v node >/dev/null 2>&1; then echo "❌ Node.js not found. Install Node 18+ from https://nodejs.org"; exit 1; fi
if [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 18 ]; then echo "❌ Node 18+ required (you have $(node -v))"; exit 1; fi

# 2. Env file (asks for keys the first time)
if [ ! -f .env.local ]; then
  echo "🔑 First run: enter your Supabase keys (Supabase → Project Settings → API)"
  read -rp "Project URL (https://xxxx.supabase.co): " URL
  read -rp "Publishable (or anon) key: " ANON
  read -rsp "service_role key (hidden): " SRV; echo
  case "$URL" in https://*) ;; *) echo "❌ URL must start with https://"; exit 1;; esac
  [ -z "$URL" ] || [ -z "$ANON" ] || [ -z "$SRV" ] && { echo "❌ All three values are required"; exit 1; }
  printf "NEXT_PUBLIC_SUPABASE_URL=%s\nNEXT_PUBLIC_SUPABASE_ANON_KEY=%s\nSUPABASE_SERVICE_ROLE_KEY=%s\n" "$URL" "$ANON" "$SRV" > .env.local
  chmod 600 .env.local
  echo "✅ Saved .env.local"
fi

# 3. Install packages if needed
if [ ! -d node_modules ]; then echo "📦 Installing packages..."; npm install; fi

# 4. Run: ./run.sh -> dev server, ./run.sh prod -> build + production server
if [ "$1" = "prod" ]; then
  npm run build && npm run start
else
  echo "🚀 http://localhost:3000   (admin: /admin/login)"
  npm run dev
fi
