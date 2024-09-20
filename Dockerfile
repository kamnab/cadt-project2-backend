FROM node:18.20.2-slim
WORKDIR /app
# ENV NODE_ENV dev
COPY package.json /app
RUN npm install
RUN apt-get update && apt install vim -y
COPY . /app
# RUN (cd frontend && npm install && npm run build)

EXPOSE 4000
CMD [ "npm", "run", "dev" ]