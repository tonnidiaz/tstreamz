# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and lock file for the monorepo
COPY ./package.json ./package-lock.json ./

# Copy the entire monorepo into the image
COPY turbo.json tsconfig.json ./
COPY apps/tu-trader/apps/tu-trader-wk ./apps/tu-trader/apps/tu-trader-wk
COPY apps/tu-trader/packages/common ./apps/tu-trader/packages/common
COPY packages/common ./packages/common

# Install dependencies for the monorepo
RUN npm install

# Install Turborepo CLI globally
RUN npm install turbo -g

# Build the app and its dependencies
RUN turbo run build --filter=tu-trader-wk

# Stage 2: Create a production image
FROM node:18-slim AS runner

# Set the working directory
WORKDIR /usr/src/app

# Copy only the built app and its dependencies from the builder stage
COPY --from=builder /usr/src/app/apps/tu-trader/apps/tu-trader-wk ./apps/tu-trader/apps/tu-trader-wk
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Expose the port your Express app listens on
EXPOSE 3000

# Use a non-root user for better security
RUN useradd --create-home --shell /bin/bash appuser
USER appuser

# Set the default command to start the app
CMD ["npm", "run", "start", "-w", "tu-trader-wk"]
