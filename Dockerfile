FROM node:20-alpine

# Install cron (busybox crond exists, but dcron is clearer)
RUN apk add --no-cache dcron tzdata

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of your code
COPY . .

# (optional) set timezone (change if you want)
ENV TZ=Europe/Paris

# Add cron schedule (midnight)
COPY crontab /etc/crontabs/root

# Start cron + your app
COPY start.sh /start.sh
RUN chmod +x /start.sh

# If you have a web server, keep this:
EXPOSE 3000

CMD ["/start.sh"]
