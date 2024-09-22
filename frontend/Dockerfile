FROM node:alpine
WORKDIR /user/app
COPY package.*json .
RUN npm install --legacy-peer-deps
COPY . .

CMD [ "npm", "start" ]
EXPOSE 3000