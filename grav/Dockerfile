FROM lscr.io/linuxserver/grav:latest
COPY pages /app/www/public/user/pages
COPY pages /config/www/grav/user/pages
COPY plugins/umami /defaults/umami-plugin
COPY config/plugins/umami.yaml /defaults/umami.yaml
COPY 99-umami.sh /custom-cont-init.d/99-umami.sh
RUN chmod +x /custom-cont-init.d/99-umami.sh /defaults/umami-plugin/umami.php
