# Build stage — frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY package*.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./

RUN npm install

COPY src ./src
COPY public ./public
COPY index.html vite.config.ts env.d.ts ./

RUN npm run build-only

# Build stage — backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY ./backend/package*.json /app/backend
COPY ./backend/tsconfig.json /app/backend

RUN npm install

COPY ./backend/src /app/backend/src

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package.json ./backend/

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 8000

CMD [ "/app/entrypoint.sh" ]
