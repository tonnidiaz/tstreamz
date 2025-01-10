# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for the monorepo
COPY ./package.json ./package-lock.json ./

# Install Turborepo CLI globally
RUN npm install turbo rimraf -g

# Copy the entire monorepo (adjust if you want to copy specific files/folders)
COPY . .

# Build the app using Turborepo
RUN turbo run build --filter=tu-trader-wk

# Stage 2: Create a smaller production image
FROM node:18-slim AS runner

# Set the working directory
WORKDIR /usr/src/app

# Copy only the built application and node_modules for the Express app
COPY --from=builder /usr/src/app/apps/tu-trader/apps/tu-trader-wk ./apps/tu-trader/apps/tu-trader-wk
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Expose the port your Express app listens on
EXPOSE 8000

# Set the default command to start the app
CMD ["npm", "run", "start", "-w", "tu-trader-wk"]
