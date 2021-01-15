# for development
FROM node:15

RUN apt-get update

USER node
WORKDIR /home/node/app

EXPOSE 9000
