# Use an official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY ./backend/package*.json ./

# Install deps
RUN npm install

# Copy the rest of your backend code
COPY ./backend ./

# Rebuild SQLite3 bindings for the container architecture
RUN npm rebuild sqlite3 --build-from-source

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
