FROM node:7.2.0

WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app/

EXPOSE 3000
VOLUME ["/data"]

ENV DEBUG server:*
CMD ["npm","start"]
