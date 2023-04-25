function clone_repo() {
    # Check that the config file exists
    local config_file="config.txt"
    if [[ ! -f $config_file ]]; then
        echo "Config file not found!"
        exit 1
    fi

    # Read the access token and repository URL from the config file
    local access_token=$(grep "^ACCESS_TOKEN=" "$config_file" | cut -d "=" -f 2)
    local repo_address=$(grep "^REPO_ADDRESS=" "$config_file" | cut -d "=" -f 2)

    # Modify the repository URL to include the access token
    repo_address=${repo_address/https:\/\//}
    repo_address="https://$access_token@$repo_address"

    # Clone the repository using the modified URL
    git clone "$repo_address" || { echo "Failed to clone repository"; exit 1; }
}
