FROM node:18

WORKDIR /app

COPY Backend/package*.json ./Backend/

RUN cd Backend && npm install

COPY . .

WORKDIR /app/Backend

EXPOSE 3000

CMD ["node", "app.js"]