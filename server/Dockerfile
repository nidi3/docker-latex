FROM node:7.2

RUN apt-get update -q
RUN apt-get install -qy texlive-full
RUN apt-get clean -q

COPY *.sh /tmp/
RUN chmod 777 /tmp/*.sh

WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app/

VOLUME ["/data"]
EXPOSE 3001

ENV DEBUG server:*
CMD ["npm","start"]


