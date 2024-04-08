# Use an official Node.js v12 Alpine image as the base image
FROM node:12-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files into the container
COPY package.json /app

# Install the application's dependencies
RUN npm install

# Copy the application code into the container
COPY . /app

# Expose port 80 for the application
EXPOSE 80

# Set the command to start the application
CMD ["node", "/app/server.js"]
