FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p uploads/pdfs

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]