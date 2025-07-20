# Build stage
FROM node:20-alpine AS builder

WORKDIR /shop-landing-page

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /shop-landing-page

# Install serve globally to serve the app in production
RUN npm install -g serve

# Copy the built files from the builder stage
COPY --from=builder /shop-landing-page/dist ./dist

# Copy the entrypoint script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 8000

# Start the app using the entrypoint script
CMD [ "/shop-landing-page/entrypoint.sh" ]
