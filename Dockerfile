from nodesource/node:6.3.0

RUN npm install -g pushstate-server
CMD pushstate-server .
ADD . .
EXPOSE 9000
