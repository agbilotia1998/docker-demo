FROM mhart/alpine-node:12
MAINTAINER Ayush agb.ayushgupta@gmail.com

RUN mkdir -p /DockerDemo
WORKDIR /DockerDemo
COPY . ./

RUN npm install

CMD ["npm", "start"]
