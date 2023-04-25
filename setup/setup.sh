#!/bin/bash
source mongo.sh
source nginx.sh
source pm2.sh
source clone.sh
set -e


function update_packages() {
    echo "Updating package lists and upgrading installed packages..."
    sudo apt update && sudo apt upgrade -y
}

function install_packages() {
    # installs necessary packages such as git, curl, etc.
    echo "Installing packages..."
    sudo apt install -y git curl
}

function install_nvm() {
    curl -o- "https://raw.githubusercontent.com/creationix/nvm/master/install.sh" | bash
}

function load_nvm() {
    echo "Loading NVM..."
    source "$HOME/.nvm/nvm.sh"
}

function install_nodejs() {
    echo "Installing Node.js..."
    nvm install node || { echo "Error installing Node.js"; exit 1; }
    nvm alias default node
}

function main() {
    clone_repo
#    update_packages
#    install_packages
#    install_mongodb
#    enable_mongodb_service
#    install_nvm
#    load_nvm
#    install_nodejs

    read -p "Do you want to set up PM2? (y/n): " setup_pm2_choice
    if [[ "$setup_pm2_choice" =~ [Yy] ]]; then
        setup_pm2
    else
        echo "Skipping PM2 setup."
    fi

    read -p "Do you want to set up NGINX? (y/n): " setup_nginx_choice
    if [[ "$setup_nginx_choice" =~ [Yy] ]]; then
        install_nginx
        setup_nginx
        setup_nginx_ssl
        restart_nginx
        echo "NGINX setup completed!"
    else
        echo "Skipping NGINX setup."
    fi
    echo "Setup completed!"
}

main
