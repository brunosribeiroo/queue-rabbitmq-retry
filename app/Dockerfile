FROM node:16.15-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8080

CMD ["npm", "start"]