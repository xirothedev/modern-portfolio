/**
 * GitHub API Utility with Caching
 * Provides cached GitHub API calls to avoid rate limiting
 */

import { githubCache, generateCacheKey, CACHE_CONFIGS } from "./github-cache";

interface GitHubAPIOptions {
	token: string;
	userAgent?: string;
}

interface FetchOptions {
	cache?: boolean;
	ttl?: number;
}

class GitHubAPI {
	private token: string;
	private userAgent: string;

	constructor(options: GitHubAPIOptions) {
		this.token = options.token;
		this.userAgent = options.userAgent || "Xiro-Portfolio/1.0";
	}

	/**
	 * Fetch repository information with caching
	 */
	async getRepository(repoName: string, options: FetchOptions = {}) {
		const cacheKey = generateCacheKey("repos", { repo: repoName });

		// Check cache first
		if (options.cache !== false) {
			const cached = githubCache.get(cacheKey);
			if (cached) {
				return cached;
			}
		}

		try {
			console.log(`🌐 Fetching repository: ${repoName}`);

			const response = await fetch(`https://api.github.com/repos/${repoName}`, {
				headers: {
					Authorization: `token ${this.token}`,
					Accept: "application/vnd.github.v3+json",
					"User-Agent": this.userAgent,
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
			}

			const data = await response.json();

			// Cache the result
			if (options.cache !== false) {
				githubCache.set(cacheKey, data, options.ttl || CACHE_CONFIGS.REPO_INFO.ttl);
			}

			return data;
		} catch (error) {
			console.error(`❌ Error fetching repository ${repoName}:`, error);
			throw error;
		}
	}

	/**
	 * Fetch repository languages with caching
	 */
	async getRepositoryLanguages(repoName: string, options: FetchOptions = {}): Promise<Record<string, number>> {
		const cacheKey = generateCacheKey("languages", { repo: repoName });

		// Check cache first
		if (options.cache !== false) {
			const cached = githubCache.get(cacheKey);
			if (cached) {
				return cached as Record<string, number>;
			}
		}

		try {
			console.log(`🌐 Fetching languages for: ${repoName}`);

			const response = await fetch(`https://api.github.com/repos/${repoName}/languages`, {
				headers: {
					Authorization: `token ${this.token}`,
					Accept: "application/vnd.github.v3+json",
					"User-Agent": this.userAgent,
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
			}

			const data = (await response.json()) as Record<string, number>;

			// Cache the result
			if (options.cache !== false) {
				githubCache.set(cacheKey, data, options.ttl || CACHE_CONFIGS.REPO_LANGUAGES.ttl);
			}

			return data;
		} catch (error) {
			console.error(
				`❌ Error fetching languages for ${repoName}:`,
				error instanceof Error ? error.message : error,
			);
			return {};
		}
	}

	/**
	 * Check rate limits
	 */
	async getRateLimit() {
		const cacheKey = generateCacheKey("rate_limit");

		// Check cache first (shorter TTL for rate limits)
		const cached = githubCache.get(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			const response = await fetch("https://api.github.com/rate_limit", {
				headers: {
					Accept: "application/vnd.github.v3+json",
					"User-Agent": this.userAgent,
				},
			});

			if (!response.ok) {
				throw new Error(`Rate limit check failed: ${response.status}`);
			}

			const data = await response.json();

			// Cache rate limit info for 5 minutes
			githubCache.set(cacheKey, data, CACHE_CONFIGS.RATE_LIMIT.ttl);

			return data;
		} catch (error) {
			console.error("❌ Error checking rate limit:", error);
			return null;
		}
	}

	/**
	 * Fetch multiple repositories with caching
	 */
	async getMultipleRepositories(repoNames: string[], options: FetchOptions = {}): Promise<Map<string, unknown>> {
		const results = new Map<string, unknown>();

		for (const repoName of repoNames) {
			try {
				const repoData = await this.getRepository(repoName, options);
				results.set(repoName, repoData);
			} catch (error) {
				console.error(`Failed to fetch ${repoName}:`, error);
				results.set(repoName, null);
			}
		}

		return results;
	}

	/**
	 * Get cache statistics
	 */
	getCacheStats() {
		return githubCache.getStats();
	}

	/**
	 * Clear cache
	 */
	clearCache() {
		githubCache.clear();
	}

	/**
	 * Clear specific cache entry
	 */
	clearCacheEntry(key: string) {
		githubCache.delete(key);
	}
}

/**
 * Create GitHub API instance
 */
export function createGitHubAPI(token: string): GitHubAPI {
	return new GitHubAPI({ token });
}

/**
 * Utility function to fetch repository data with fallback
 */
export async function fetchRepositoryWithFallback(
	api: GitHubAPI,
	repoName: string,
	fallbackData: NonNullable<unknown>,
) {
	try {
		const repoData = await api.getRepository(repoName);
		return {
			...fallbackData,
			...repoData,
			isFromGitHub: true,
		};
	} catch (error) {
		console.warn(`Using fallback data for ${repoName}:`, error instanceof Error ? error.message : error);
		return {
			...fallbackData,
			isFromGitHub: false,
		};
	}
}
