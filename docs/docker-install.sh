#Update Ubuntu’s package list
sudo apt update
#Install basic tools needed for adding Docker safely
#   ca-certificates -> Lets your server trust HTTPS certificates.
#   curl -> Tool to download content from URLs (used to fetch Docker’s GPG key).
#   gnupg -> Tools for cryptographic signing.
#   -y to yes
sudo apt install -y ca-certificates curl gnupg

# Create a secure folder for repo signing keys
#   -d = create a directory
# 	-m 0755 = set permissions
sudo install -m 0755 -d /etc/apt/keyrings
# Download Docker’s signing key and store it in the right format
# curl -fsSL ...
# 	-f fail on errors (don’t output HTML error pages)
# 	-s silent
# 	-S show errors if fail
# 	-L follow redirects

# GPG keys can be “armored” (text form).
#   --dearmor converts it into a binary format apt likes.
#   -o ... writes it to /etc/apt/keyrings/docker.gpg
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker’s repository to apt sources

# dpkg --print-architecture
# Outputs your CPU arch, e.g.
# 	amd64 (most EC2)
# 	arm64 (some instances)
# So Docker repo matches your machine.

# signed-by=/etc/apt/keyrings/docker.gpg
# Tells apt: “trust this repo only if packages match this key”

# $(. /etc/os-release && echo $VERSION_CODENAME)
# This reads your Ubuntu codename, like:
# 	•	jammy (22.04)
# 	•	noble (24.04)
# So it uses the correct repo path for your Ubuntu version.

# tee /etc/apt/sources.list.d/docker.list
# Writes that repo line into a file so apt remembers it.

# > /dev/null
# Hides tee output to keep terminal clean.

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update apt again (now includes Docker repo)
sudo apt update
# Install Docker + Docker Compose
# docker-ce -> Docker Engine (the daemon that runs containers)
# docker-ce-cli ->	The docker command you type in terminal
# containerd.io -> Lower-level container runtime Docker uses under the hood
# docker-compose-plugin -> let you run docker compose
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add your user to the docker group
#   usermod changes a user account
#   -aG docker means “append to group docker”
#   $USER is your current username 
sudo usermod -aG docker $USER
# Apply group change immediately
newgrp docker