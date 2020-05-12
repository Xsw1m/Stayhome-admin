#!/bin/sh
cd /www
npm install
npm run build:prod
npm run dev
/bin/bash
