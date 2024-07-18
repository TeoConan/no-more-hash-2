#!/bin/bash

git pull
./node_modules/pm2/bin/pm2 stop no-more-hash-2
npm run build
./node_modules/pm2/bin/pm2 start no-more-hash-2