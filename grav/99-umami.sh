#!/usr/bin/with-contenv bash
# Copy Umami plugin into Grav's persistent user dir, and stamp the Admin2 SPA.
set -euo pipefail
USER_ROOTS=(
  /config/www/grav/user
  /app/www/public/user
)
for root in "${USER_ROOTS[@]}"; do
  mkdir -p "${root}/plugins/umami" "${root}/config/plugins"
  cp -a /defaults/umami-plugin/. "${root}/plugins/umami/"
  cp /defaults/umami.yaml "${root}/config/plugins/umami.yaml"
done

SNIPPET='<script defer src="https://analytics.happylittleventures.com/script.js" data-website-id="cd3038d1-dfb4-4006-8f29-4b644b22586e" data-domains="grav.happylittleventures.com"></script>'
while IFS= read -r -d '' file; do
  if ! grep -q 'analytics.happylittleventures.com/script.js' "$file"; then
    sed -i "s#</head>#${SNIPPET}</head>#" "$file" || true
  fi
done < <(find /config /app /usr -name 'index.html' -path '*admin2*' -print0 2>/dev/null || true)
