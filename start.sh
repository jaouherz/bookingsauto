#!/bin/sh
set -e

# start cron
crond

# keep container running + show logs
touch /var/log/booking.log
tail -f /var/log/booking.log
