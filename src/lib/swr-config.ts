/**
 * SWR Configuration for Client-Side Caching
 * Optimizes data fetching with proper caching strategies
 */

import { SWRConfiguration } from "swr";

// Default fetcher function for SWR
export const fetcher = async (url: string) => {
	const response = await fetch(url, {
		signal: AbortSignal.timeout(10000), // 10 second timeout
	});

	if (!response.ok) {
		const error = new Error("Failed to fetch data");
		(error as any).status = response.status;
		(error as any).info = await response.text();
		throw error;
	}

	return response.json();
};

// SWR configuration optimized for GitHub API data
export const swrConfig: SWRConfiguration = {
	fetcher,

	// Caching Strategy
	revalidateOnFocus: false, // Don't refetch when window regains focus
	revalidateOnReconnect: true, // Refetch when network reconnects
	revalidateIfStale: true, // Refetch if data is stale

	// Timing Configuration
	refreshInterval: 30 * 60 * 1000, // Auto refresh every 30 minutes
	dedupingInterval: 10 * 60 * 1000, // Dedupe requests within 10 minutes

	// Error Handling
	errorRetryCount: 3, // Retry failed requests 3 times
	errorRetryInterval: 1000, // Wait 1 second between retries
	shouldRetryOnError: (error) => {
		// Don't retry on 4xx errors (client errors)
		if (error?.status >= 400 && error?.status < 500) {
			return false;
		}
		return true;
	},

	// Performance
	keepPreviousData: true, // Keep previous data while fetching new data
};

// Specialized config for GitHub projects
export const githubProjectsConfig: SWRConfiguration = {
	...swrConfig,

	// GitHub-specific optimizations
	refreshInterval: 15 * 60 * 1000, // Refresh every 15 minutes for GitHub data
	dedupingInterval: 5 * 60 * 1000, // Shorter deduping for more dynamic data
};

// Cache key generators
export const cacheKeys = {
	githubProjects: "/api/github",
	githubProject: (repoName: string) => `/api/github/${repoName}`,
} as const;

// Helper function to manually mutate cache
export const mutateGitHubProjects = async (mutate: any, updater?: any) => {
	return mutate(cacheKeys.githubProjects, updater, {
		revalidate: false, // Don't revalidate immediately
		populateCache: true, // Update the cache with new data
	});
};

// Helper to clear specific cache entries
export const clearCache = (mutate: any, key: string) => {
	return mutate(key, undefined, { revalidate: false });
};
