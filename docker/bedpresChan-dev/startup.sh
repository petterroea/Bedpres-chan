#!/bin/bash

echo "Waiting for DB to fire up...."

./wait-for-it.sh db:27017
echo "Db started"
sleep 4
ls -l

set -e

exec $@
