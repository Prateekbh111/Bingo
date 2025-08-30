# Use Node.js Alpine image
FROM node:24-alpine

# Install necessary packages for Prisma
RUN apk add --no-cache \
    openssl \
    ca-certificates

WORKDIR /app

# Copy all package files
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/ws/package.json ./apps/ws/
COPY packages/db/package.json ./packages/db/
COPY turbo.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Copy root .env to apps (your current approach)
RUN if [ -f ".env" ]; then \
    cp .env ./apps/web/.env && \
    cp .env ./apps/ws/.env && \
    echo "Copied .env to apps"; \
    else \
    echo "No .env file found at root"; \
    fi

# Generate Prisma client
WORKDIR /app/packages/db
RUN npx prisma generate --no-engine

# Back to root app
WORKDIR /app

# Build applications
RUN npm run build

# Expose ports
EXPOSE 3000 8080

CMD ["npm", "run", "start"]