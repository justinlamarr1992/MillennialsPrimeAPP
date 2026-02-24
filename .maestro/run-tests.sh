#!/bin/bash
# Loads .env credentials into the shell environment before running Maestro.
# Maestro reads env vars from the shell — it does not source .env files directly.

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"

if [ -f "$ENV_FILE" ]; then
  # Export only non-comment, non-empty lines
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
else
  echo "Warning: .env file not found at $ENV_FILE"
  echo "Maestro test credentials (MAESTRO_PRIME_EMAIL, etc.) must be set manually."
fi

export PATH="$PATH:$HOME/.maestro/bin"

maestro "$@"
