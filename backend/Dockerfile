# STAGE 1 - Build Stage

FROM node:22-alpine AS build

# Set working directory inside container
WORKDIR /backend

# Copy dependency files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy project files into container
COPY . .

#STAGE 2 - Runtime Stage

FROM node:22-alpine AS runtime

# Set working directory inside container
WORKDIR /backend

# Copy files from previous stage (dependencies + source code)
COPY --from=build /backend /backend

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expost app port
EXPOSE 4000

# Use non-root user for better security
RUN addgroup -S nodeapp && adduser -S nodeuser -G nodeapp
USER nodeuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
CMD wget -qO- http://localhost:${PORT}/health || exit 1

# Default command to start the app
CMD ["node", "index.js"]