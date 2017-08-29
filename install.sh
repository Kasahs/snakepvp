#!/bin/sh
nvm use v8.1.3
cd client
npm install
cd ../server
npm install
cd ..
