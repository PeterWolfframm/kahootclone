#!/usr/bin/with-contenv bash
# Copy Umami plugin into Grav's persistent user dir on every start.
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
