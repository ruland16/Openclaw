#!/usr/bin/env bash
# clean-email.sh — Trash emails from known junk senders via gog CLI
# Usage: bash scripts/clean-email.sh [--dry-run]
#
# Senders list (edit SENDERS array below to add/remove):
#   Vista Auction, Amazon, AliExpress, USPS, Google, Kia Connect, NC Virtual Academy

set -euo pipefail

# --- Required env ---
export GOG_KEYRING_BACKEND=file
export GOG_KEYRING_PASSWORD='SecureKeyring123!'
ACCOUNT="ruland16@gmail.com"

# --- Options ---
DRY_RUN=""
FORCE="--force"
MAX=500

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  FORCE=""
  echo "🔍 DRY RUN — no emails will be trashed"
fi

# --- Senders to trash ---
# Each entry is a Gmail search query fragment (from: address or keyword)
SENDERS=(
  "from:vistaauction.com"
  "from:amazon.com"
  "from:aliexpress.com"
  "from:usps.com"
  "from:google.com"
  "from:kiaconnect.com OR from:owners.kia.com OR from:kia.com OR from:no-reply@notification.kiausa.com"
  "from:ncvacademy.org OR from:ncvirtualacademy.org OR from:ncvps.org"
  "from:notifications@instructure.com"
)

LABELS=(
  "Vista Auction"
  "Amazon"
  "AliExpress"
  "USPS"
  "Google"
  "Kia Connect"
  "NC Virtual Academy"
  "Instructure Notifications"
)

TOTAL_TRASHED=0

echo "🧹 Email Cleanup — $(date '+%Y-%m-%d %H:%M')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for i in "${!SENDERS[@]}"; do
  query="in:inbox newer_than:14d (${SENDERS[$i]})"
  label="${LABELS[$i]}"

  echo ""
  echo "📧 $label"
  echo "   Query: $query"

  # Count matching messages first
  count=$(gog gmail messages search "$query" --account "$ACCOUNT" --max "$MAX" --json --no-input 2>/dev/null | jq 'if type == "array" then length elif .messages then (.messages | length) else 0 end' 2>/dev/null || echo "0")

  if [[ "$count" == "0" || "$count" == "null" ]]; then
    echo "   ✅ No emails found — already clean"
    continue
  fi

  echo "   Found: $count email(s)"

  # Trash them
  if gog gmail trash --query "$query" --account "$ACCOUNT" --max "$MAX" $FORCE $DRY_RUN --no-input 2>&1; then
    echo "   🗑️  Trashed $count email(s)"
    TOTAL_TRASHED=$((TOTAL_TRASHED + count))
  else
    echo "   ⚠️  Error trashing — check logs"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Done! Total trashed: $TOTAL_TRASHED email(s)"
