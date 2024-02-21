FROM node:18.18-alpine3.18
COPY . /TECHUTSAV_AUTH

WORKDIR /TECHUTSAV_AUTH
CMD npm install --force && npm start