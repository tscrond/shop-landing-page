#!/bin/sh

# Start backend (serves API at /api)
PORT=${PORT:-8000} \
CORS_ORIGIN="*" \
SERVE_STATIC=/app/frontend/dist \
node /app/backend/dist/index.js
