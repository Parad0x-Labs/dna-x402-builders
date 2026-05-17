FROM node:22-alpine

WORKDIR /app
COPY package.json ./
RUN npm install
COPY src ./src
COPY .env.example ./.env.example

CMD ["npm", "run", "start"]

