#!/bin/sh
set -e

# start cron
crond

# ensure log file exists
mkdir -p /var/log
touch /var/log/booking.log

# start tiny HTTP server IN BACKGROUND (so healthcheck passes)
node -e "require('http').createServer((req,res)=>res.end('OK')).listen(3000,'0.0.0.0')" &

# keep container alive + stream logs to Back4App logs UI
tail -f /var/log/booking.log
