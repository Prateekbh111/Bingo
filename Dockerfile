# Use Node.js Debian-based image for better Prisma compatibility
FROM node:18-slim

# Install necessary packages for Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy all package files
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/ws/package.json ./apps/ws/
COPY packages/db/package.json ./packages/db/
COPY turbo.json ./

# Install all dependencies in root
RUN npm install

# Copy all source code
COPY . .

# Generate Prisma client and run migrations
WORKDIR /app/packages/db
RUN npx prisma generate --no-engine

# Build web app
WORKDIR /app/apps/web
RUN npm run build

# Build WebSocket server
WORKDIR /app/apps/ws
RUN npm run build

# Back to root for runtime
WORKDIR /app

# Expose ports
EXPOSE 3000 8080

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/packages/db && npx prisma db push &' >> /app/start.sh && \
    echo 'cd /app/apps/web && npm start &' >> /app/start.sh && \
    echo 'cd /app/apps/ws && npm start &' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]