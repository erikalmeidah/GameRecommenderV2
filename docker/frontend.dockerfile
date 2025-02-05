# Use an official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY ./frontend/package.json ./
RUN npm install

# Copy the rest of the frontend code
COPY ./frontend .

# Expose the port the frontend dev server runs on (adjust according to your dev server's config)
EXPOSE 3000

# Run the frontend with npm run dev (assuming you're using a development server like Vite or Next.js)
CMD ["npm", "run", "dev"]
