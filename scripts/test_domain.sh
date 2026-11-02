#!/usr/bin/env bash
set -euo pipefail

EXPECTED_DOMAIN="aime.io"

if [[ ! -f CNAME ]]; then
  echo "CNAME file missing"
  exit 1
fi

ACTUAL_DOMAIN="$(tr -d '\r\n' < CNAME)"
if [[ "$ACTUAL_DOMAIN" != "$EXPECTED_DOMAIN" ]]; then
  echo "CNAME mismatch: expected '$EXPECTED_DOMAIN' got '$ACTUAL_DOMAIN'"
  exit 1
fi

echo "CNAME check passed: $ACTUAL_DOMAIN"

# BOLT OPTIMIZATION: Combine A and AAAA record lookups into a single 'dig' call.
# This reduces execution time by minimizing network round-trips and process forks.
# We use pure Bash to parse the results, avoiding extra forks like 'grep' or 'awk'.
A_RECORDS=""
AAAA_RECORDS=""
while read -r _ _ _ type value; do
  if [[ "$type" == "A" ]]; then
    A_RECORDS="${A_RECORDS}${value}"$'\n'
  elif [[ "$type" == "AAAA" ]]; then
    AAAA_RECORDS="${AAAA_RECORDS}${value}"$'\n'
  fi
done < <(dig +noall +answer "$EXPECTED_DOMAIN" A "$EXPECTED_DOMAIN" AAAA || true)

# Remove trailing newlines
A_RECORDS="${A_RECORDS%$'\n'}"
AAAA_RECORDS="${AAAA_RECORDS%$'\n'}"

if [[ -z "$A_RECORDS" && -z "$AAAA_RECORDS" ]]; then
  echo "No DNS A/AAAA records found for $EXPECTED_DOMAIN"
  exit 1
fi

echo "DNS check passed for $EXPECTED_DOMAIN"
echo "A records:"
echo "$A_RECORDS"
echo "AAAA records:"
echo "$AAAA_RECORDS"
