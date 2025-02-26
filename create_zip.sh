#!/bin/bash
rm -rf function
npm run build
cp -R dist function
cp package.json function/package.json
cd function
npm install --omit=dev
zip -r function.zip .