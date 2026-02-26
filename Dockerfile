FROM node:20-alpine

RUN apk add --no-cache dcron tzdata

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Tunisia time so "midnight" means Tunisia midnight
ENV TZ=Africa/Tunis

COPY crontab /etc/crontabs/root

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
