FROM node:alpine3.18 as buildClient
WORKDIR /var/tmp
COPY package*.json .
RUN npm install --silent
COPY . .
RUN npm run build


FROM node:alpine3.18 as runClient
WORKDIR /opt/tms
COPY --from=buildFrontend /var/tmp/dist .
RUN npm install -g serve
CMD serve -s -p 5173 .
