FROM node:22-alpine AS build
WORKDIR /app

COPY drum-books-eshop/package*.json ./
RUN npm install

RUN npm install pdfjs-dist

COPY drum-books-eshop/ .
RUN npm run build --configuration=production

FROM nginx:stable-alpine
COPY --from=build /app/dist/drum-books-eshop/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]