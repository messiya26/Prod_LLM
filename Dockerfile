FROM node:20-alpine AS builder
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm install --ignore-scripts
COPY apps/api/ ./
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
RUN mkdir -p uploads logs
EXPOSE 3002
ENV NODE_ENV=production
ENV PORT=3002
CMD ["node", "dist/main.js"]
