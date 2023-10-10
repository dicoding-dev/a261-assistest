#!/bin/bash

if [ ! -z "$AGRSUSER" ]; then
    usermod -u $AGRSUSER assistest
fi

rm -f /home/assistest/reports/report.json || true
chown -R assistest:assistest /home/assistest/student-app
exec gosu assistest "$@"
