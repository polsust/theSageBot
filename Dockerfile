FROM node:18-buster

RUN apt-get update -y && apt-get install -y ffmpeg

WORKDIR /app

COPY . /app

RUN yarn

RUN yarn build

CMD ["yarn", "start"]
