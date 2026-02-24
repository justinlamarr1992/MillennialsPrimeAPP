#!/bin/bash
# Loads .env credentials into the shell environment before running Maestro.
# Maestro reads env vars from the shell — it does not source .env files directly.

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"

if [ -f "$ENV_FILE" ]; then
  # Parse and export only KEY=VALUE lines — avoids executing arbitrary shell code
  # that a plain `source` would run (e.g. command substitution in .env values).
  while IFS= read -r line || [ -n "$line" ]; do
    # Strip leading/trailing whitespace
    trimmed="${line#"${line%%[![:space:]]*}"}"
    trimmed="${trimmed%"${trimmed##*[![:space:]]}"}"
    # Skip blank lines and comments
    [ -z "$trimmed" ] || [ "${trimmed#\#}" != "$trimmed" ] && continue
    # Only export safe KEY=VALUE pairs (no spaces around =, valid var name)
    case "$trimmed" in
      [A-Za-z_][A-Za-z0-9_]*=*)
        var_name="${trimmed%%=*}"
        var_value="${trimmed#*=}"
        export "$var_name=$var_value"
        ;;
    esac
  done < "$ENV_FILE"
else
  echo "Warning: .env file not found at $ENV_FILE"
  echo "Maestro test credentials (MAESTRO_PRIME_EMAIL, etc.) must be set manually."
fi

export PATH="$PATH:$HOME/.maestro/bin"

maestro "$@"
