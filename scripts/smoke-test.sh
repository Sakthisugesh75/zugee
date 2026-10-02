#!/bin/bash
# scripts/smoke-test.sh
# Post-deployment smoke tests for Zugee website.
# Run after every production deploy to catch availability regressions.
#
# Usage:
#   SITE_URL=https://www.getzugee.com ./scripts/smoke-test.sh
#
# Exit codes:
#   0  — all checks passed
#   1  — one or more checks failed

set -euo pipefail

SITE="${SITE_URL:-https://www.getzugee.com}"
PASS=0
FAIL=0

check() {
  local label="$1"
  shift
  if "$@" > /dev/null 2>&1; then
    echo "  ✓ $label"
    PASS=$((PASS + 1))
  else
    echo "  ✗ FAIL: $label"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "=== Zugee Smoke Tests ==="
echo "    Target: $SITE"
echo ""

echo "— Availability —"
check "Homepage returns 200"           curl --fail --silent --show-error --max-time 15 "$SITE/"
check "robots.txt returns 200"         curl --fail --silent --show-error --max-time 10 "$SITE/robots.txt"
check "sitemap.xml returns 200"        curl --fail --silent --show-error --max-time 10 "$SITE/sitemap.xml"

echo ""
echo "— Crawler Access —"
check "Googlebot can access homepage"  curl --fail --silent --show-error --max-time 15 -A "Googlebot" "$SITE/"
check "Facebook crawler can access"    curl --fail --silent --show-error --max-time 15 -A "facebookexternalhit/1.1" "$SITE/"

echo ""
echo "— Content Integrity —"

# Check for accidental noindex on homepage
if curl -s --max-time 15 "$SITE/" | grep -qi 'noindex'; then
  echo "  ✗ FAIL: Homepage contains noindex directive!"
  FAIL=$((FAIL + 1))
else
  echo "  ✓ Homepage does not contain noindex"
  PASS=$((PASS + 1))
fi

# Check homepage has a title tag
if curl -s --max-time 15 "$SITE/" | grep -qi '<title>'; then
  echo "  ✓ Homepage has a <title> tag"
  PASS=$((PASS + 1))
else
  echo "  ✗ FAIL: Homepage is missing <title> tag"
  FAIL=$((FAIL + 1))
fi

# Check robots.txt contains Sitemap directive
if curl -s --max-time 10 "$SITE/robots.txt" | grep -qi 'sitemap'; then
  echo "  ✓ robots.txt contains Sitemap directive"
  PASS=$((PASS + 1))
else
  echo "  ✗ FAIL: robots.txt is missing Sitemap directive"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "⚠️  Some smoke tests failed. Investigate before confirming deployment."
  exit 1
else
  echo "✅ All smoke tests passed."
  exit 0
fi
