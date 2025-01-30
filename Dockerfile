#   docker build -t cadt-project2-backend .
#   docker run -p 4000:40000 cadt-project2-backend
# ------------------------------------------------

# Use the official Node.js image as the base image
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Optional: Install dotenv if you're using environment files for configuration
RUN npm install dotenv --production

# Copy the .env file to the container (if you are using dotenv in the app)
COPY .env .env

# Copy the rest of the application code
COPY . .

# RUN (cd frontend && npm install && npm run build)

EXPOSE 4000
CMD [ "npm", "start" ]
