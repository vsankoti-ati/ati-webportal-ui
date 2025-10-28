# ATI Webportal UI - Multi-stage Docker build
# Stage 1: Dependencies installation
FROM node:18-alpine AS dependencies

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Ensure a public directory exists so the runner stage can always copy it.
# Some projects don't have a `public` folder; creating it avoids a failing COPY
RUN mkdir -p public

# Build the Next.js application
RUN npm run build

# Stage 3: Production runtime
FROM node:18-alpine AS runner

# Set environment variables
ENV NODE_ENV=local
ENV NEXT_TELEMETRY_DISABLED=1

# Add a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy the standalone build from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable for port
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]