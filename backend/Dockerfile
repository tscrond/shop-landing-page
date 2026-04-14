# Build stage
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
COPY backend/tsconfig.json ./

RUN npm install

COPY backend/src ./src

RUN npm run build


# Production stage
FROM node:20-alpine

WORKDIR /app/backend

COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist


EXPOSE 8000

CMD ["node", "dist/index.js"]