FROM node:alpine3.18
WORKDIR /app
COPY . .
COPY ./cleanDB/db_TM.db ./db_TM_dirty.db
RUN npm install --silent
EXPOSE 3001
CMD node index.js
