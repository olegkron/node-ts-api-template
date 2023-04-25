#!/bin/bash

set -e

APP_PATH=$(pwd)
CONFIG_FILE="pm2.config.js"


function install_pm2() {
  echo "Installing PM2..."
  npm install -g pm2 || { echo "Error installing PM2"; exit 1; }
}

function create_pm2_config() {
  echo "Creating PM2 config file..."
  cat > $CONFIG_FILE <<EOL
module.exports = {
  apps: [{
    name: 'app',
    script: './dist/index.js',
    watch: true,
    ignore_watch: ['node_modules'],
    autorestart: true,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};
EOL
}

function setup_pm2() {
  echo "Changing to app directory..."
  cd $APP_PATH

  create_pm2_config

  echo "Starting the app with PM2..."
  pm2 start $CONFIG_FILE --env production

  echo "Setup PM2 completed!"
}
