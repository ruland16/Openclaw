#!/bin/bash
# Setup GitHub backup for OpenClaw workspace

set -e

WORKSPACE_DIR="/home/user/.openclaw/workspace"
GITHUB_REPO="https://github.com/ruland16/Openclaw.git"
GITHUB_SSH="git@github.com:ruland16/Openclaw.git"

echo "=== OpenClaw GitHub Backup Setup ==="
echo ""

# Check if already configured
if git -C "$WORKSPACE_DIR" remote get-url origin >/dev/null 2>&1; then
    CURRENT_REMOTE=$(git -C "$WORKSPACE_DIR" remote get-url origin)
    echo "GitHub remote already configured: $CURRENT_REMOTE"
    echo ""
    read -p "Reconfigure? (y/N): " RECONFIGURE
    if [ "$RECONFIGURE" != "y" ] && [ "$RECONFIGURE" != "Y" ]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

echo "Choose authentication method:"
echo "1. SSH (recommended for automation)"
echo "2. HTTPS with personal access token"
echo "3. Skip GitHub setup for now"
echo ""
read -p "Enter choice (1-3): " AUTH_CHOICE

case $AUTH_CHOICE in
    1)
        # SSH method
        echo ""
        echo "=== SSH Key Setup ==="
        
        # Check for existing SSH key
        if [ -f ~/.ssh/id_ed25519 ] || [ -f ~/.ssh/id_rsa ]; then
            echo "Existing SSH key found."
            read -p "Use existing key? (Y/n): " USE_EXISTING
            if [ "$USE_EXISTING" != "n" ] && [ "$USE_EXISTING" != "N" ]; then
                echo "Using existing SSH key."
            else
                echo "Generating new SSH key..."
                ssh-keygen -t ed25519 -C "openclaw-backup@$(hostname)" -f ~/.ssh/id_openclaw -N ""
                echo "New SSH key generated: ~/.ssh/id_openclaw"
            fi
        else
            echo "No SSH key found. Generating new one..."
            mkdir -p ~/.ssh
            ssh-keygen -t ed25519 -C "openclaw-backup@$(hostname)" -f ~/.ssh/id_ed25519 -N ""
            echo "SSH key generated: ~/.ssh/id_ed25519"
        fi
        
        # Show public key
        echo ""
        echo "=== Add this public key to GitHub ==="
        echo "1. Go to: https://github.com/settings/keys"
        echo "2. Click 'New SSH key'"
        echo "3. Paste the key below:"
        echo ""
        if [ -f ~/.ssh/id_openclaw.pub ]; then
            cat ~/.ssh/id_openclaw.pub
            KEY_FILE="~/.ssh/id_openclaw"
        elif [ -f ~/.ssh/id_ed25519.pub ]; then
            cat ~/.ssh/id_ed25519.pub
            KEY_FILE="~/.ssh/id_ed25519"
        elif [ -f ~/.ssh/id_rsa.pub ]; then
            cat ~/.ssh/id_rsa.pub
            KEY_FILE="~/.ssh/id_rsa"
        else
            echo "ERROR: No public key found!"
            exit 1
        fi
        
        echo ""
        read -p "Press Enter after adding key to GitHub..."
        
        # Test SSH connection
        echo "Testing SSH connection to GitHub..."
        if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
            echo "SSH connection successful!"
        else
            echo "Warning: SSH test failed. Continuing anyway..."
        fi
        
        # Configure git remote
        cd "$WORKSPACE_DIR"
        git remote remove origin 2>/dev/null || true
        git remote add origin "$GITHUB_SSH"
        echo "Configured SSH remote: $GITHUB_SSH"
        ;;
    
    2)
        # HTTPS with token
        echo ""
        echo "=== HTTPS with Personal Access Token ==="
        echo "1. Go to: https://github.com/settings/tokens"
        echo "2. Generate new token with 'repo' scope"
        echo "3. Copy the token (keep it secret!)"
        echo ""
        read -p "Enter your GitHub username: " GITHUB_USER
        read -sp "Enter your GitHub token: " GITHUB_TOKEN
        echo ""
        
        # Configure git with token
        cd "$WORKSPACE_DIR"
        git remote remove origin 2>/dev/null || true
        git remote add origin "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/ruland16/Openclaw.git"
        
        # Store credentials
        git config credential.helper 'store --file ~/.git-credentials-openclaw'
        echo "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com" > ~/.git-credentials-openclaw
        chmod 600 ~/.git-credentials-openclaw
        
        echo "Configured HTTPS remote with token."
        ;;
    
    3)
        echo "Skipping GitHub setup."
        exit 0
        ;;
    
    *)
        echo "Invalid choice."
        exit 1
        ;;
esac

# Test push
echo ""
echo "=== Testing GitHub push ==="
cd "$WORKSPACE_DIR"
if git push -u origin master; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "Repository: https://github.com/ruland16/Openclaw"
    echo "Your workspace is now backed up to GitHub."
else
    echo "❌ Push failed. Check authentication and try again."
    echo "You can run this script again to reconfigure."
fi

echo ""
echo "=== Setup Complete ==="
echo "Backup script will now automatically push to GitHub."
echo "Run manually: ./backup.sh"
echo "Schedule with cron: 0 2 * * * $(pwd)/backup.sh"