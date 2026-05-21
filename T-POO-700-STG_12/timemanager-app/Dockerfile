# Dockerfile for Vue.js

# Use an official Node.js image
FROM node:18-alpine as base

# Set the working directory
WORKDIR /app

# Copy the Vue.js application files
COPY . .

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

FROM base AS prod
# Command to start build
RUN ["pnpm", "run", "build"]

# Expose the port that the Vue.js app will run on
EXPOSE 4173

# Command to start Vite development server
CMD ["pnpm", "run", "preview", "--host"]

FROM base AS dev
# Expose the port that the Vue.js app will run on
EXPOSE 5173

# Command to start Vite development server with --host flag
CMD ["pnpm", "run", "dev", "--host"]
