FROM node:alpine
WORKDIR /app/user
COPY package.*json .
RUN npm install

COPY . .

CMD [ "npm","start","--openssl" ]
EXPOSE 8000