# Build stage
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY package*.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./

RUN npm install

COPY src ./src
COPY public ./public
COPY index.html vite.config.ts env.d.ts ./

RUN npm run build-only


# Production stage (nginx with templating)
FROM nginx:alpine

# Copy template instead of static config
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]