# Environment Variables Setup for OpenNext

This guide explains how to set up environment variables for your OpenNext project deployed on Cloudflare Workers.

## 📋 Overview

OpenNext uses Cloudflare Workers for deployment, which requires specific environment variable configuration:

- **Development**: Uses `.dev.vars` file
- **Production**: Uses `wrangler.jsonc` configuration and secrets
- **Sensitive data**: Stored as Cloudflare secrets

## 🚀 Quick Setup

### 1. Automated Setup (Recommended)

Run the automated setup script:

```bash
pnpm run setup-env
```

This script will:

- Check if Wrangler CLI is installed
- Verify Cloudflare login
- Guide you through setting up GitHub token
- Show current environment configuration

### 2. Manual Setup

If you prefer manual setup, follow the steps below.

## 🔧 Manual Configuration

### Development Environment (.dev.vars)

Create or update `.dev.vars` file in your project root:

```env
NEXTJS_ENV=development
NODE_ENV=development
# Add your GitHub token here for development
# GITHUB_TOKEN=your_github_token_here
```

### Production Environment (wrangler.jsonc)

The `wrangler.jsonc` file is already configured with:

```json
{
	"vars": {
		"NEXTJS_ENV": "production",
		"NODE_ENV": "production"
	}
}
```

### Secrets Setup

For sensitive data like API tokens, use Cloudflare secrets:

```bash
# Set GitHub token as secret
echo "your_github_token_here" | wrangler secret put GITHUB_TOKEN

# Set other secrets as needed
echo "your_secret_value" | wrangler secret put SECRET_NAME
```

## 🔑 Environment Variables

### Required Variables

| Variable     | Description         | Development   | Production   |
| ------------ | ------------------- | ------------- | ------------ |
| `NEXTJS_ENV` | Next.js environment | `development` | `production` |
| `NODE_ENV`   | Node.js environment | `development` | `production` |

### Optional Variables

| Variable        | Description      | Type   | Usage              |
| --------------- | ---------------- | ------ | ------------------ |
| `GITHUB_TOKEN`  | GitHub API token | Secret | GitHub integration |
| `NEXT_PUBLIC_*` | Public variables | Var    | Client-side access |

### GitHub Token Setup

1. **Create GitHub Token**:
    - Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
    - Click "Generate new token (classic)"
    - Select `public_repo` scope
    - Copy the token

2. **Set as Secret**:

    ```bash
    echo "your_github_token_here" | wrangler secret put GITHUB_TOKEN
    ```

3. **Development**:
   Add to `.dev.vars`:
    ```env
    GITHUB_TOKEN=your_github_token_here
    ```

## 📁 File Structure

```
modern-portfolio/
├── .dev.vars              # Development environment variables
├── wrangler.jsonc         # Cloudflare Workers configuration
├── cloudflare-env.d.ts    # TypeScript environment types
├── scripts/
│   └── setup-env.sh      # Automated setup script
└── ENVIRONMENT_SETUP.md   # This file
```

## 🔍 TypeScript Support

The `cloudflare-env.d.ts` file provides TypeScript support for environment variables:

```typescript
declare namespace Cloudflare {
	interface Env {
		NEXTJS_ENV: string;
		NODE_ENV: string;
		GITHUB_TOKEN?: string;
		WORKER_SELF_REFERENCE: Fetcher;
		ASSETS: Fetcher;
	}
}
```

## 🚀 Deployment Commands

### Build and Deploy

```bash
# Build and deploy to Cloudflare
pnpm run deploy

# Build and preview locally
pnpm run preview

# Build and upload to Cloudflare
pnpm run upload
```

### Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## 🔧 Troubleshooting

### Common Issues

1. **Wrangler not installed**:

    ```bash
    npm install -g wrangler
    ```

2. **Not logged in to Cloudflare**:

    ```bash
    wrangler login
    ```

3. **Environment variables not working**:
    - Check `.dev.vars` for development
    - Check `wrangler.jsonc` for production
    - Verify secrets are set correctly

4. **TypeScript errors**:
    ```bash
    pnpm run cf-typegen
    ```

### Debug Commands

```bash
# Check Wrangler status
wrangler whoami

# List secrets
wrangler secret list

# View environment variables
wrangler secret list

# Test locally
wrangler dev
```

## 📚 Documentation

- [Cloudflare Workers Environment Variables](https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables)
- [Cloudflare Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [OpenNext Documentation](https://opennext.js.org/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## 🔒 Security Notes

- Never commit `.dev.vars` to version control
- Use secrets for sensitive data in production
- The `.dev.vars` file is already in `.gitignore`
- Environment variables in `wrangler.jsonc` are public

## 🎯 Best Practices

1. **Use secrets for sensitive data**
2. **Keep development and production configs separate**
3. **Use TypeScript for type safety**
4. **Test environment variables locally before deploying**
5. **Document all environment variables**
6. **Use descriptive variable names**

---

**Need help?** Check the [OpenNext documentation](https://opennext.js.org/) or create an issue in the repository.
