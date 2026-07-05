#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL must be set, e.g. postgres://postgres:postgres@localhost:5432/ataakademi_test}"

MIGRATIONS_DIR="${MIGRATIONS_DIR:-db/migrations}"
SMOKE_SQL="${SMOKE_SQL:-qa/db/smoke.sql}"
REQUIRE_MIGRATIONS="${REQUIRE_MIGRATIONS:-false}"

if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required but was not found on PATH" >&2
  exit 1
fi

apply_migrations() {
  if [[ ! -d "$MIGRATIONS_DIR" ]]; then
    if [[ "$REQUIRE_MIGRATIONS" == "true" ]]; then
      echo "Migration directory not found: $MIGRATIONS_DIR" >&2
      exit 1
    fi

    echo "No migration directory found at $MIGRATIONS_DIR. Skipping migration apply step."
    echo "Set REQUIRE_MIGRATIONS=true in migration PR CI when db/migrations must exist."
    return 0
  fi

  shopt -s nullglob
  local files=("$MIGRATIONS_DIR"/*.sql)
  shopt -u nullglob

  if [[ ${#files[@]} -eq 0 ]]; then
    if [[ "$REQUIRE_MIGRATIONS" == "true" ]]; then
      echo "No SQL migration files found in $MIGRATIONS_DIR" >&2
      exit 1
    fi

    echo "No SQL migration files found in $MIGRATIONS_DIR. Skipping migration apply step."
    return 0
  fi

  IFS=$'\n' files=($(printf '%s\n' "${files[@]}" | sort))
  unset IFS

  for file in "${files[@]}"; do
    echo "Applying migration: $file"
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$file"
  done
}

run_smoke_tests() {
  if [[ ! -f "$SMOKE_SQL" ]]; then
    echo "Smoke SQL file not found: $SMOKE_SQL" >&2
    exit 1
  fi

  echo "Running DB-level QA smoke tests: $SMOKE_SQL"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SMOKE_SQL"
}

apply_migrations
run_smoke_tests
