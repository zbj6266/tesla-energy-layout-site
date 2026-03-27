FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY src ./src

EXPOSE 10000

CMD echo "Starting migration..." && node src/db/migrate.js && echo "Migration done, starting server..." && node src/index.js
