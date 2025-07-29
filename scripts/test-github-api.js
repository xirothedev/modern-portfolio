#!/usr/bin/env node

/**
 * Test script for GitHub API route
 * This script tests the GitHub API integration directly
 */

const https = require("https");

// Test GitHub API directly
async function testGitHubAPI() {
	console.log("🔍 Testing GitHub API directly...");

	const token = "gh_token";
	const repo = "xirothedev/discord-bot-dashboard";

	const options = {
		hostname: "api.github.com",
		path: `/repos/${repo}`,
		method: "GET",
		headers: {
			Authorization: `token ${token}`,
			Accept: "application/vnd.github.v3+json",
			"User-Agent": "Xiro-Portfolio-Test/1.0",
		},
	};

	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			let data = "";

			res.on("data", (chunk) => {
				data += chunk;
			});

			res.on("end", () => {
				console.log(`📊 Status: ${res.statusCode}`);
				console.log(`📋 Headers:`, res.headers);

				if (res.statusCode === 200) {
					const repoData = JSON.parse(data);
					console.log("✅ GitHub API working correctly");
					console.log(`📦 Repository: ${repoData.full_name}`);
					console.log(`⭐ Stars: ${repoData.stargazers_count}`);
					console.log(`🍴 Forks: ${repoData.forks_count}`);
					console.log(`🏷️ Topics: ${repoData.topics?.join(", ") || "None"}`);
					resolve(repoData);
				} else {
					console.log("❌ GitHub API error");
					console.log("Response:", data);
					reject(new Error(`HTTP ${res.statusCode}: ${data}`));
				}
			});
		});

		req.on("error", (error) => {
			console.error("❌ Request error:", error);
			reject(error);
		});

		req.end();
	});
}

// Test rate limits
async function testRateLimit() {
	console.log("\n🔍 Testing rate limits...");

	const options = {
		hostname: "api.github.com",
		path: "/rate_limit",
		method: "GET",
		headers: {
			Accept: "application/vnd.github.v3+json",
			"User-Agent": "Xiro-Portfolio-Test/1.0",
		},
	};

	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			let data = "";

			res.on("data", (chunk) => {
				data += chunk;
			});

			res.on("end", () => {
				if (res.statusCode === 200) {
					const rateLimit = JSON.parse(data);
					console.log("📊 Rate limit info:");
					console.log(`   Core: ${rateLimit.resources.core.remaining}/${rateLimit.resources.core.limit}`);
					console.log(
						`   Search: ${rateLimit.resources.search.remaining}/${rateLimit.resources.search.limit}`,
					);
					resolve(rateLimit);
				} else {
					reject(new Error(`HTTP ${res.statusCode}: ${data}`));
				}
			});
		});

		req.on("error", (error) => {
			console.error("❌ Rate limit check error:", error);
			reject(error);
		});

		req.end();
	});
}

// Main test function
async function runTests() {
	try {
		console.log("🚀 Starting GitHub API tests...\n");

		// Test rate limits first
		await testRateLimit();

		// Test GitHub API
		await testGitHubAPI();

		console.log("\n✅ All tests passed!");
		console.log("\n💡 If the API works here but not in your app, check:");
		console.log("   1. Environment variables are loaded correctly");
		console.log("   2. Next.js is reading .env.local or .dev.vars");
		console.log("   3. Server is restarted after adding environment variables");
	} catch (error) {
		console.error("\n❌ Test failed:", error.message);
		process.exit(1);
	}
}

// Run tests if this script is executed directly
if (require.main === module) {
	runTests();
}

module.exports = { testGitHubAPI, testRateLimit };
