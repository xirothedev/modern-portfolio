#!/usr/bin/env node

/**
 * Test script for GitHub Cache System
 * This script tests the caching functionality
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// Load environment variables
function loadEnvFile(filePath) {
	if (fs.existsSync(filePath)) {
		const content = fs.readFileSync(filePath, "utf8");
		const lines = content.split("\n");

		for (const line of lines) {
			const trimmedLine = line.trim();
			if (trimmedLine && !trimmedLine.startsWith("#")) {
				const [key, ...valueParts] = trimmedLine.split("=");
				if (key && valueParts.length > 0) {
					const value = valueParts.join("=").trim();
					process.env[key.trim()] = value.replace(/^["']|["']$/g, "");
				}
			}
		}
	}
}

// Load environment variables
loadEnvFile(path.join(process.cwd(), ".env.development"));
loadEnvFile(path.join(process.cwd(), ".env.local"));

// Simple cache simulation
class SimpleCache {
	constructor() {
		this.cache = new Map();
		this.defaultTTL = 12 * 60 * 60 * 1000; // 12 hours
	}

	get(key) {
		const cached = this.cache.get(key);
		if (!cached) {
			console.log(`📦 Cache miss: ${key}`);
			return null;
		}

		const now = Date.now();
		if (now > cached.expiresAt) {
			console.log(`⏰ Cache expired: ${key}`);
			this.cache.delete(key);
			return null;
		}

		console.log(`✅ Cache hit: ${key} (expires in ${Math.round((cached.expiresAt - now) / 1000 / 60)} minutes)`);
		return cached.data;
	}

	set(key, data, ttl = this.defaultTTL) {
		const now = Date.now();
		const expiresAt = now + ttl;

		this.cache.set(key, {
			data,
			timestamp: now,
			expiresAt,
		});

		console.log(`💾 Cached: ${key} (expires in ${Math.round(ttl / 1000 / 60)} minutes)`);
	}

	getStats() {
		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys()),
		};
	}

	clear() {
		this.cache.clear();
		console.log("🗑️ Cache cleared");
	}
}

// Test cache functionality
async function testCache() {
	console.log("🧪 Testing GitHub Cache System...\n");

	const cache = new SimpleCache();
	const token = process.env.GITHUB_TOKEN;
	const repo = "xirothedev/discord-bot-dashboard";

	if (!token) {
		console.log("❌ No GitHub token found");
		return;
	}

	// Test 1: First fetch (cache miss)
	console.log("🔄 Test 1: First fetch (should be cache miss)");
	const cacheKey1 = `github:repos?repo=${repo}`;

	let cachedData = cache.get(cacheKey1);
	if (!cachedData) {
		console.log("   Fetching from GitHub API...");
		const data = await fetchGitHubRepo(repo, token);
		cache.set(cacheKey1, data);
		cachedData = data;
	}

	// Test 2: Second fetch (cache hit)
	console.log("\n🔄 Test 2: Second fetch (should be cache hit)");
	const cacheKey2 = `github:repos?repo=${repo}`;

	cachedData = cache.get(cacheKey2);
	if (!cachedData) {
		console.log("   Fetching from GitHub API...");
		const data = await fetchGitHubRepo(repo, token);
		cache.set(cacheKey2, data);
	}

	// Test 3: Different repository (cache miss)
	console.log("\n🔄 Test 3: Different repository (should be cache miss)");
	const repo2 = "xirothedev/next-15-template";
	const cacheKey3 = `github:repos?repo=${repo2}`;

	cachedData = cache.get(cacheKey3);
	if (!cachedData) {
		console.log("   Fetching from GitHub API...");
		const data = await fetchGitHubRepo(repo2, token);
		cache.set(cacheKey3, data);
	}

	// Test 4: Cache statistics
	console.log("\n📊 Cache Statistics:");
	const stats = cache.getStats();
	console.log(`   Cache size: ${stats.size}`);
	console.log(`   Cached keys: ${stats.keys.join(", ")}`);

	// Test 5: Cache expiration simulation
	console.log("\n🔄 Test 5: Cache expiration simulation");
	const shortTTL = 5 * 1000; // 5 seconds
	const cacheKey4 = `github:test?expires=5s`;

	cache.set(cacheKey4, { test: "data" }, shortTTL);
	console.log("   Waiting 6 seconds for cache to expire...");

	setTimeout(() => {
		const expiredData = cache.get(cacheKey4);
		if (!expiredData) {
			console.log("   ✅ Cache correctly expired");
		} else {
			console.log("   ❌ Cache should have expired");
		}

		console.log("\n✅ Cache system test completed!");
		console.log("\n💡 Benefits:");
		console.log("   • Reduces API calls to GitHub");
		console.log("   • Avoids rate limiting");
		console.log("   • Faster response times");
		console.log("   • Automatic expiration");
		console.log("   • Memory efficient");
	}, 6000);
}

// Fetch GitHub repository data
async function fetchGitHubRepo(repoName, token) {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: "api.github.com",
			path: `/repos/${repoName}`,
			method: "GET",
			headers: {
				Authorization: `token ${token}`,
				Accept: "application/vnd.github.v3+json",
				"User-Agent": "Xiro-Portfolio-Cache-Test/1.0",
			},
		};

		const req = https.request(options, (res) => {
			let data = "";

			res.on("data", (chunk) => {
				data += chunk;
			});

			res.on("end", () => {
				if (res.statusCode === 200) {
					const repoData = JSON.parse(data);
					resolve({
						name: repoData.name,
						stars: repoData.stargazers_count,
						forks: repoData.forks_count,
						language: repoData.language,
						topics: repoData.topics || [],
					});
				} else {
					reject(new Error(`HTTP ${res.statusCode}: ${data}`));
				}
			});
		});

		req.on("error", (error) => {
			reject(error);
		});

		req.end();
	});
}

// Run test
testCache().catch(console.error);
