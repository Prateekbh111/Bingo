#!/bin/bash
# Build script for Railway deployment
# This ensures Prisma client is generated before TypeScript compilation

set -e

echo "Starting build process..."

# Try to generate Prisma client from various possible locations
if [ -f ../../packages/db/prisma/schema.prisma ]; then
    echo "Found schema at ../../packages/db/prisma/schema.prisma"
    npx prisma generate --schema=../../packages/db/prisma/schema.prisma
elif [ -f packages/db/prisma/schema.prisma ]; then
    echo "Found schema at packages/db/prisma/schema.prisma"
    npx prisma generate --schema=packages/db/prisma/schema.prisma
elif [ -f ../packages/db/prisma/schema.prisma ]; then
    echo "Found schema at ../packages/db/prisma/schema.prisma"
    npx prisma generate --schema=../packages/db/prisma/schema.prisma
else
    echo "Warning: Could not find Prisma schema. Attempting default generate..."
    npx prisma generate || echo "Prisma generate failed, but continuing..."
fi

# Build TypeScript
echo "Building TypeScript..."
tsc -b

echo "Build complete!"

