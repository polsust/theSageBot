FROM node:1
WORKDIR /app
COPY . .
EXPOSE 8080
CMD [ "node", "index.js"]