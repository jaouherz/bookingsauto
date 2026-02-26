FROM node:20-alpine

RUN apk add --no-cache dcron tzdata

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV TZ=Africa/Tunis

COPY crontab /etc/crontabs/root

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 3000

CMD ["/start.sh"]
