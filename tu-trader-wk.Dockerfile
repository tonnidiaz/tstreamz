# Base image
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy the root package.json and lock file (to install dependencies for the entire monorepo)
COPY ./package.json ./package-lock.json* ./

# Copy workspace configuration (if using pnpm or yarn workspaces)
COPY ./turbo.json* ./

# Install dependencies (for the entire monorepo)
RUN npm install -w=tu-trader-wk

# Copy the entire monorepo
COPY . .

# Navigate to the app directory and build the app
WORKDIR /app/apps/my-app
RUN npm run build # or 'yarn build' or 'pnpm build'

# -- Production image --
FROM node:18 AS runner

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/apps/my-app /app

# Install only production dependencies
RUN npm install --production # or 'yarn install --production' or 'pnpm install --prod'

# Expose the app port
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"] # Replace with your app's start command
