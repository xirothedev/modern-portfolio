/**
 * GitHub API Cache System
 * Caches GitHub repository data for 12 hours to avoid rate limiting
 */

interface CachedData {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
	timestamp: number;
	expiresAt: number;
}

// interface CacheConfig {
//   ttl: number; // Time to live in milliseconds (12 hours = 12 * 60 * 60 * 1000)
//   key: string;
// }

class GitHubCache {
	private static instance: GitHubCache;
	private cache: Map<string, CachedData> = new Map();
	private readonly defaultTTL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

	private constructor() {
		// Load cache from memory (will be cleared on server restart)
		console.log("🚀 GitHub Cache initialized");
	}

	static getInstance(): GitHubCache {
		if (!GitHubCache.instance) {
			GitHubCache.instance = new GitHubCache();
		}
		return GitHubCache.instance;
	}

	/**
	 * Get cached data if it exists and is not expired
	 */
	get(key: string) {
		const cached = this.cache.get(key);

		if (!cached) {
			console.log(`📦 Cache miss for key: ${key}`);
			return null;
		}

		const now = Date.now();

		if (now > cached.expiresAt) {
			console.log(`⏰ Cache expired for key: ${key}`);
			this.cache.delete(key);
			return null;
		}

		console.log(
			`✅ Cache hit for key: ${key} (expires in ${Math.round((cached.expiresAt - now) / 1000 / 60)} minutes)`,
		);
		return cached.data;
	}

	/**
	 * Set data in cache with TTL
	 */
	set(key: string, data: unknown, ttl: number = this.defaultTTL): void {
		const now = Date.now();
		const expiresAt = now + ttl;

		this.cache.set(key, {
			data,
			timestamp: now,
			expiresAt,
		});

		console.log(`💾 Cached data for key: ${key} (expires in ${Math.round(ttl / 1000 / 60)} minutes)`);
	}

	/**
	 * Clear specific cache entry
	 */
	delete(key: string): void {
		this.cache.delete(key);
		console.log(`🗑️ Cleared cache for key: ${key}`);
	}

	/**
	 * Clear all cache
	 */
	clear(): void {
		this.cache.clear();
		console.log("🗑️ Cleared all cache");
	}

	/**
	 * Get cache statistics
	 */
	getStats(): { size: number; keys: string[] } {
		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys()),
		};
	}

	/**
	 * Check if cache has valid data for a key
	 */
	has(key: string): boolean {
		const cached = this.cache.get(key);
		if (!cached) return false;

		const now = Date.now();
		if (now > cached.expiresAt) {
			this.cache.delete(key);
			return false;
		}

		return true;
	}
}

/**
 * Generate cache key for GitHub API calls
 */
export function generateCacheKey(endpoint: string, params?: Record<string, unknown>): string {
	const baseKey = `github:${endpoint}`;

	if (!params) return baseKey;

	const paramString = Object.entries(params)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, value]) => `${key}=${value}`)
		.join("&");

	return paramString ? `${baseKey}?${paramString}` : baseKey;
}

/**
 * Cache configuration for different GitHub endpoints
 */
export const CACHE_CONFIGS = {
	REPO_INFO: {
		ttl: 12 * 60 * 60 * 1000, // 12 hours
		key: "repo_info",
	},
	REPO_LANGUAGES: {
		ttl: 12 * 60 * 60 * 1000, // 12 hours
		key: "repo_languages",
	},
	RATE_LIMIT: {
		ttl: 5 * 60 * 1000, // 5 minutes
		key: "rate_limit",
	},
} as const;

export const githubCache = GitHubCache.getInstance();
