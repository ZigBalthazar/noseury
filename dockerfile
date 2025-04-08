# ---- Build stage ----
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Copy only what's needed for building
    COPY package*.json ./
    RUN npm install
    
    # Copy source files
    COPY . .
    
    # Build TypeScript code
    RUN npm run build
    
    # ---- Production stage ----
    FROM node:18-alpine
    
    WORKDIR /app
    
    # Copy only built output and prod deps
    COPY --from=builder /app/package*.json ./
    RUN npm install --omit=dev
    
    COPY --from=builder /app/dist ./dist
    
    # Expose port
    EXPOSE 3000
    
    # Start server
    CMD ["node", "dist/server.js"]
    