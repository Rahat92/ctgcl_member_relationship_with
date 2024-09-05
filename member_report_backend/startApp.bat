@echo off
REM Step 1: Start the PM2 service with the initial environment variable values
set PORT=3002
set MY_ENV_VAR=initial_value
set IS_EMAIL_MODULE=true
set NAME=InitialName

pm2 start ecosystem.config.js --env production --update-env --name my-app
