# Use the official Node.js 14 image as base
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

RUN apt-get update && apt-get install -y mongodb-clients


# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8081

# Command to run the application
CMD ["node", "index.js", "mongod", "--bind_ip_all"]
