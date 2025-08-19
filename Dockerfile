# Use Node.js as base
FROM node:18-alpine

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
RUN npx prisma generate

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
    echo 'cd /app/packages/db && npx prisma migrate deploy &' >> /app/start.sh && \
    echo 'cd /app/apps/web && npm start &' >> /app/start.sh && \
    echo 'cd /app/apps/ws && npm start &' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]