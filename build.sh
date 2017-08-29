#!/bin/sh
cd ./client
npm run wp
cd ../server
npm run build-ts
node dist/main.js
cd ..