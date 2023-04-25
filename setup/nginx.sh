#!/bin/bash

set -e

function install_nginx() {
  echo "Installing NGINX..."
  sudo apt install -y nginx || { echo "Error installing NGINX"; exit 1; }
}

function setup_nginx() {
  echo "Setting up NGINX configuration..."
  read -p "Enter your domain: " DOMAIN

  # Create a backup of the existing nginx config
  sudo cp /etc/nginx/sites-available/default{,.bak}

  SERVER_CONFIG=$(cat <<EOF
server {
    listen 8080 default_server;
    listen [::]:8080 default_server;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
)
  echo "$SERVER_CONFIG" | sudo tee /etc/nginx/sites-available/default > /dev/null
  sudo nginx -t && sudo systemctl reload nginx
}

function setup_nginx_ssl() {
  echo "Setting up SSL for NGINX..."
  sudo add-apt-repository ppa:certbot/certbot
  sudo apt-get update
  sudo apt-get install python-certbot-nginx
  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN
  sudo certbot renew --dry-run
}
install_nginx
setup_nginx
restart_nginx
nginx_ssl_setup


function restart_nginx() {
  echo "Checking NGINX config..."
  sudo nginx -t

  echo "Restarting NGINX..."
  if ! command -v nginx &> /dev/null; then
    echo "NGINX is not installed!"
    exit 1
  fi
  sudo systemctl restart nginx

}
