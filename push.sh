#!/usr/bin/env bash
# One-command GitHub push: creates a PRIVATE repo (if missing) and pushes this folder.
# Re-run any time to push new changes. Your token is never saved or printed.
set -e
cd "$(dirname "$0")"
command -v git >/dev/null || { echo "❌ git missing: sudo apt install git"; exit 1; }
command -v curl >/dev/null || { echo "❌ curl missing: sudo apt install curl"; exit 1; }

# Remember username/repo for next runs (no secrets stored)
CFG=.push.conf
[ -f "$CFG" ] && . "$CFG"
read -rp "GitHub username [${GH_USER:-}]: " u; GH_USER="${u:-$GH_USER}"
read -rp "Repo name [${GH_REPO:-51}]: " r; GH_REPO="${r:-${GH_REPO:-51}}"
[ -z "$GH_USER" ] && { echo "❌ username required"; exit 1; }
printf 'GH_USER=%s\nGH_REPO=%s\n' "$GH_USER" "$GH_REPO" > "$CFG"
grep -qx "$CFG" .gitignore 2>/dev/null || echo "$CFG" >> .gitignore

echo "Token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → scope 'repo'"
read -rsp "GitHub token (hidden): " TOKEN; echo
[ -z "$TOKEN" ] && { echo "❌ token required"; exit 1; }

# Safety: never commit secrets
grep -q '^\.env' .gitignore || echo ".env*" >> .gitignore
[ -d .git ] || git init -q
git rm -r --cached -q .env.local 2>/dev/null || true
git config user.name  >/dev/null || git config user.name  "$GH_USER"
git config user.email >/dev/null || git config user.email "$GH_USER@users.noreply.github.com"

# Create private repo if it does not exist
code=$(curl -s -o /tmp/gh_resp -w "%{http_code}" -X POST https://api.github.com/user/repos \
  -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
  -d "{\"name\":\"$GH_REPO\",\"private\":true}")
case "$code" in
  201) echo "✅ Created private repo $GH_USER/$GH_REPO";;
  422) echo "ℹ️  Repo already exists, pushing to it";;
  401) echo "❌ Bad token"; exit 1;;
  *)   echo "❌ GitHub API error ($code)"; head -c 300 /tmp/gh_resp; echo; exit 1;;
esac

git add -A
if ! git diff --cached --quiet; then git commit -q -m "${1:-update}"; echo "✅ Committed"; else echo "ℹ️  Nothing new to commit"; fi
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GH_USER/$GH_REPO.git"

# Push using a temporary askpass helper so the token never lands in git config/history
ASK=$(mktemp); trap 'rm -f "$ASK" /tmp/gh_resp' EXIT
printf '#!/bin/sh\ncase "$1" in Username*) echo "%s";; *) echo "$GH_TOKEN_TMP";; esac\n' "$GH_USER" > "$ASK"; chmod 700 "$ASK"
GIT_ASKPASS="$ASK" GIT_TERMINAL_PROMPT=0 GH_TOKEN_TMP="$TOKEN" git push -u origin main
unset TOKEN
echo "🚀 Done: https://github.com/$GH_USER/$GH_REPO"
echo "Next: vercel.com → Add New → Project → import $GH_REPO"
