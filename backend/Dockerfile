FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the source
COPY src ./src

EXPOSE 3000

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]