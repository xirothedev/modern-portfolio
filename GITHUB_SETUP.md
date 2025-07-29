# GitHub API Integration Setup

This project now includes GitHub API integration to automatically fetch repository data including stars, forks, and other metadata for your projects.

## Setup Instructions

### 1. Create GitHub Personal Access Token

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Portfolio API"
4. Select the following scopes:
    - `public_repo` (to read public repository data)
5. Click "Generate token"
6. Copy the token (you won't be able to see it again)

### 2. Add Token to Environment Variables

Create a `.env.local` file in the root directory and add:

```env
GITHUB_TOKEN=your_github_token_here
```

Replace `your_github_token_here` with the token you copied from GitHub.

### 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

## Features

The GitHub integration provides:

- **Real-time data**: Stars, forks, and language information from your repositories
- **Language distribution**: Shows percentage breakdown of languages used in each repository
- **Dynamic tags**: Automatically fetches and displays GitHub topics as project tags
- **Smart topic formatting**: Converts kebab-case topics to readable Title Case
- **Priority sorting**: Important technologies are shown first
- **Automatic updates**: Data is cached for 1 hour and automatically refreshed
- **Fallback support**: If the API fails, it falls back to static data
- **Loading states**: Beautiful loading skeletons while fetching data
- **Error handling**: Graceful error states with retry functionality

## API Endpoint

The integration uses the `/api/github` endpoint which:

- Fetches data from GitHub's REST API
- Retrieves language distribution for each repository
- Caches responses for 1 hour
- Handles rate limiting gracefully
- Returns structured project data

### Language Distribution

The API fetches detailed language statistics for each repository:

- **Language percentages**: Shows the proportion of each programming language used
- **Visual language bar**: Displays a color-coded bar similar to GitHub's interface
- **Top 5 languages**: Shows the most used languages with their percentages
- **Real-time data**: Updates automatically when you push new code

## Repository Configuration

Repositories are configured in `src/app/api/github/route.ts`. To add or modify repositories:

1. Update the `PROJECTS` array in the API route
2. Add your repository information
3. The API will automatically fetch the latest data

## Troubleshooting

### Token Issues

- Make sure your token has the `public_repo` scope
- Verify the token is correctly added to `.env.local`
- Check that the file is in the root directory

### API Rate Limits

- GitHub has rate limits for API calls
- The integration includes caching to minimize API calls
- If you hit rate limits, the system will use fallback data

### Repository Not Found

- Verify repository names are correct (format: `username/repository`)
- Ensure repositories are public
- Check that the repository exists and is accessible

## Security Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- Use environment variables for sensitive data in production
