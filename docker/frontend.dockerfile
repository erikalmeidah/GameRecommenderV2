# Use the official Node.js image with Alpine (lighter weight)
FROM node:18-alpine AS build-frontend

# Set the working directory inside the container
WORKDIR /app

# Install dependencies (frontend code)
COPY ./frontend/package.json ./
RUN npm install

# Copy the rest of the frontend code
COPY ./frontend ./

# Expose the port for the frontend server
EXPOSE 5173

# Run the frontend application (assuming you're using Vite)
CMD ["npm", "run", "dev"]
