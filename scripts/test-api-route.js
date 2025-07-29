#!/usr/bin/env node

/**
 * Test script for API route with environment variables
 * This script simulates the API route with proper environment loading
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// Load environment variables from .env.local manually
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
					process.env[key.trim()] = value.replace(/^["']|["']$/g, ""); // Remove quotes
				}
			}
		}
	}
}

// Load environment variables
loadEnvFile(path.join(process.cwd(), ".env.development"));
loadEnvFile(path.join(process.cwd(), ".env.local")); // Fallback

// Simulate the API route logic
async function testAPIRoute() {
	console.log("🔍 Testing API Route with Environment Variables...\n");

	// Check environment variables (same as API route)
	const githubToken =
		process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;

	console.log("GitHub token found:", githubToken ? "Yes" : "No");
	console.log("Environment variables:", {
		NEXTJS_ENV: process.env.NEXTJS_ENV,
		NODE_ENV: process.env.NODE_ENV,
		hasGitHubToken: !!githubToken,
	});

	if (!githubToken) {
		console.log("❌ No GitHub token found - this would cause the 403 error");
		return;
	}

	// Test the same repositories as in the API
	const projects = [
		{ repoName: "xirothedev/discord.js-template-v14" },
		{ repoName: "xirothedev/discord-bot-dashboard" },
		{ repoName: "xirothedev/xiro-discord-bot-music" },
		{ repoName: "xirothedev/next-15-template" },
	];

	for (const project of projects) {
		try {
			console.log(`\n📦 Testing repository: ${project.repoName}`);

			const response = await fetch(`https://api.github.com/repos/${project.repoName}`, {
				headers: {
					Authorization: `token ${githubToken}`,
					Accept: "application/vnd.github.v3+json",
					"User-Agent": "Xiro-Portfolio/1.0",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.log(`❌ Failed to fetch ${project.repoName}: ${response.status} - ${errorText}`);

				if (response.status === 403) {
					console.log(`   🔍 Rate limit or permission issue for ${project.repoName}`);
				} else if (response.status === 404) {
					console.log(`   🔍 Repository not found: ${project.repoName}`);
				} else if (response.status === 401) {
					console.log(`   🔍 Unauthorized - check GitHub token permissions`);
				}
			} else {
				const repoData = await response.json();
				console.log(`✅ Successfully fetched ${project.repoName}: ${repoData.stargazers_count} stars`);
				console.log(`   🏷️ Topics: ${repoData.topics?.join(", ") || "None"}`);
			}
		} catch (error) {
			console.error(`❌ Error fetching ${project.repoName}:`, error.message);
		}
	}
}

// Use node-fetch if available, otherwise use https
async function fetch(url, options) {
	return new Promise((resolve, reject) => {
		const urlObj = new URL(url);
		const req = https.request(
			{
				hostname: urlObj.hostname,
				path: urlObj.pathname + urlObj.search,
				method: options.method || "GET",
				headers: options.headers || {},
			},
			(res) => {
				let data = "";

				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					resolve({
						ok: res.statusCode >= 200 && res.statusCode < 300,
						status: res.statusCode,
						text: () => Promise.resolve(data),
						json: () => Promise.resolve(JSON.parse(data)),
					});
				});
			},
		);

		req.on("error", (error) => {
			reject(error);
		});

		req.end();
	});
}

// Main test function
async function runTest() {
	try {
		await testAPIRoute();

		console.log("\n✅ API Route test completed!");
		console.log("\n💡 Cache Benefits:");
		console.log("   1. Reduces GitHub API calls");
		console.log("   2. Avoids rate limiting");
		console.log("   3. Faster response times");
		console.log("   4. Data cached for 12 hours");
		console.log("   5. Cache cleared on server restart");

		console.log("\n🔧 Cache Management:");
		console.log("   GET /api/github/cache - View cache stats");
		console.log("   DELETE /api/github/cache - Clear all cache");
		console.log("   DELETE /api/github/cache?key=xxx - Clear specific cache");

		console.log("\n💡 If you see 403 errors here, the issue is:");
		console.log("   1. GitHub token permissions");
		console.log("   2. Rate limiting");
		console.log("   3. Repository access");

		console.log("\n💡 If this works but your app doesn't:");
		console.log("   1. Restart your Next.js development server");
		console.log("   2. Check that .env.development is being loaded");
		console.log("   3. Verify the API route is being called correctly");
	} catch (error) {
		console.error("\n❌ Test failed:", error.message);
		process.exit(1);
	}
}

// Run test if this script is executed directly
if (require.main === module) {
	runTest();
}

module.exports = { testAPIRoute };
