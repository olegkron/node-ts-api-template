#!/bin/bash

MONGODB_VERSION="6.0"

function install_mongodb() {
  echo "Installing MongoDB $MONGODB_VERSION..."
  wget -qO - "https://www.mongodb.org/static/pgp/server-$MONGODB_VERSION.asc" | sudo apt-key add - || { echo "Error adding MongoDB repository key"; exit 1; }
  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/$MONGODB_VERSION multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-$MONGODB_VERSION.list
  sudo apt install -y mongodb-org
}

function enable_mongodb_service() {
  echo "Enabling and starting MongoDB service..."
  sudo systemctl enable mongod || { echo "Error enabling MongoDB service"; exit 1; }
  sudo systemctl start mongod || { echo "Error starting MongoDB service"; exit 1; }
}
