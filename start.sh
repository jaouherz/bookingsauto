#!/bin/sh
set -e

# start cron
crond

# start tiny server so Back4App sees open port
node -e "require('http').createServer((req,res)=>res.end('OK')).listen(3000)"

# keep container alive
tail -f /var/log/booking.log
