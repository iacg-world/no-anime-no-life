FROM node:20
USER root
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm run build
COPY . /usr/src/app
EXPOSE 80 3000
CMD npm run server