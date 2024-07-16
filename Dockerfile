# Use an official Node.js image as a base
FROM node:20.14

# Set the working directory to /app
WORKDIR /app

# Define arguments to load from the .env file
ARG MONG_URI
ARG PORT
ARG STRIPE_SECRET_KEY

# Set environment variables
ENV MONG_URI=$MONG_URI
ENV PORT=$PORT
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY

# Copy the package.json file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port
EXPOSE $PORT

# Run the command to start the server
CMD ["npm", "run", "dev"]