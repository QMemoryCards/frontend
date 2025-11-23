#!/bin/sh
set -e

# Substitute environment variables in nginx.conf.template
envsubst '${BACKEND_HOST} ${BACKEND_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec "$@"
