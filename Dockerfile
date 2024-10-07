# Use the official Node.js image as the base image
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# RUN (cd frontend && npm install && npm run build)

EXPOSE 4000
CMD [ "npm", "run", "dev" ]


# ------------------------------------------------
#   docker build -t cadt-project2-backend .
#   docker run -p 4000:40000 cadt-project2-backend
