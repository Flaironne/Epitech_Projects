FROM node:alpine as base

RUN apk add --no-cache g++ make py3-pip libc6-compat

WORKDIR /app

COPY ./package*.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "preview"]

EXPOSE 3000