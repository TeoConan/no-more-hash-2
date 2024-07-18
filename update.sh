#!/bin/bash

git pull
pm2 stop .
npm run build
pm2 start .