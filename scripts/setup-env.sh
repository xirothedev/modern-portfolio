#!/bin/bash

# OpenNext Environment Setup Script
# This script helps set up environment variables and secrets for OpenNext deployment

echo "🚀 Setting up OpenNext Environment Variables..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed. Please install it first:"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if user is logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "❌ You are not logged in to Cloudflare. Please login first:"
    echo "wrangler login"
    exit 1
fi

echo "✅ Wrangler CLI is ready"

# Set up GitHub Token secret
echo ""
echo "🔑 Setting up GitHub Token secret..."
echo "This is optional but recommended for GitHub API integration"
echo "You can get a token from: https://github.com/settings/tokens"
echo "Required scope: public_repo"
echo ""

read -p "Do you want to set up GitHub Token? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Please enter your GitHub token (it will be hidden):"
    read -s GITHUB_TOKEN
    
    if [ -n "$GITHUB_TOKEN" ]; then
        echo "Setting GitHub token as secret..."
        echo "$GITHUB_TOKEN" | wrangler secret put GITHUB_TOKEN
        echo "✅ GitHub token set successfully"
    else
        echo "❌ No token provided"
    fi
fi

# Set up other environment variables
echo ""
echo "📝 Setting up environment variables..."

# Check if .dev.vars exists and has content
if [ -f ".dev.vars" ]; then
    echo "✅ .dev.vars file exists"
    echo "Current content:"
    cat .dev.vars
else
    echo "❌ .dev.vars file not found"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'pnpm run build' to build your project"
echo "2. Run 'pnpm run deploy' to deploy to Cloudflare"
echo "3. Or run 'pnpm run preview' to test locally"
echo ""
echo "📚 Documentation:"
echo "- Environment variables: https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables"
echo "- Secrets: https://developers.cloudflare.com/workers/configuration/secrets/"
echo "- OpenNext: https://opennext.js.org/" 