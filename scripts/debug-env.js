#!/usr/bin/env node

/**
 * Debug script for Next.js environment variables
 * This script helps debug environment variable loading issues
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Debugging Next.js Environment Variables...\n");

// Check if .env.development exists
const envDevPath = path.join(process.cwd(), ".env.development");
if (fs.existsSync(envDevPath)) {
	console.log("\n✅ .env.development file found");
	const envDevContent = fs.readFileSync(envDevPath, "utf8");
	console.log("📄 Content:");
	console.log(envDevContent);
} else {
	console.log("\n❌ .env.development file not found");
}

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
	console.log("\n✅ .env.local file found");
	const envLocalContent = fs.readFileSync(envLocalPath, "utf8");
	console.log("📄 Content:");
	console.log(envLocalContent);
} else {
	console.log("\n❌ .env.local file not found");
}

// Check if .dev.vars exists
const devVarsPath = path.join(process.cwd(), ".dev.vars");
if (fs.existsSync(devVarsPath)) {
	console.log("\n✅ .dev.vars file found");
	const devVarsContent = fs.readFileSync(devVarsPath, "utf8");
	console.log("📄 Content:");
	console.log(devVarsContent);
} else {
	console.log("\n❌ .dev.vars file not found");
}

// Check if .env exists
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
	console.log("\n✅ .env file found");
	const envContent = fs.readFileSync(envPath, "utf8");
	console.log("📄 Content:");
	console.log(envContent);
} else {
	console.log("\n❌ .env file not found");
}

// Check current environment variables
console.log("\n🔧 Current Environment Variables:");
console.log("NEXTJS_ENV:", process.env.NEXTJS_ENV || "undefined");
console.log("NODE_ENV:", process.env.NODE_ENV || "undefined");
console.log("GITHUB_TOKEN:", process.env.GITHUB_TOKEN ? "***set***" : "undefined");

// Check Next.js specific variables
console.log("\n📋 Next.js Environment Variables:");
console.log("NEXT_PUBLIC_GITHUB_TOKEN:", process.env.NEXT_PUBLIC_GITHUB_TOKEN ? "***set***" : "undefined");

// Check if we're in a Next.js context
console.log("\n🏗️ Next.js Context:");
console.log("Current working directory:", process.cwd());
console.log("Node.js version:", process.version);
console.log("Platform:", process.platform);

// Check for Next.js configuration
const nextConfigPath = path.join(process.cwd(), "next.config.ts");
if (fs.existsSync(nextConfigPath)) {
	console.log("\n✅ next.config.ts found");
} else {
	console.log("\n❌ next.config.ts not found");
}

console.log("\n💡 Troubleshooting Tips:");
console.log("1. Make sure .env.local is in the project root");
console.log("2. Restart the development server after adding environment variables");
console.log("3. Check that variables don't have spaces around the = sign");
console.log("4. For Next.js, use .env.local for development");
console.log("5. For Cloudflare, use .dev.vars for development");
console.log("6. For production, use wrangler secrets");

console.log("\n🚀 Next Steps:");
console.log("1. Run: pnpm run dev");
console.log("2. Check browser console for API errors");
console.log("3. Run: pnpm run test-github");
console.log("4. Check server logs for environment variable loading");
