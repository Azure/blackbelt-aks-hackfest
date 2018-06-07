FROM node:9.4.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN apk --no-cache add curl
EXPOSE 8080

CMD [ "npm", "run", "container" ]