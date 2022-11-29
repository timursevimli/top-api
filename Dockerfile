FROM node:latest

WORKDIR /app

EXPOSE 3000

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm prune --production --force

CMD ["node", "./dist/main.js"]