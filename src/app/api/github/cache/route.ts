import { NextRequest, NextResponse } from "next/server";

import { createGitHubAPI } from "@/lib/github-api";

export async function GET() {
	try {
		const githubAPI = createGitHubAPI();
		const cacheStats = githubAPI.getCacheStats();
		const rateLimit = await githubAPI.getRateLimit();

		return NextResponse.json({
			cache: cacheStats,
			rateLimit,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error getting cache stats:", error);
		return NextResponse.json({ error: "Failed to get cache stats" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const key = searchParams.get("key");

		const githubToken =
			process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;

		if (!githubToken) {
			return NextResponse.json({ error: "GitHub token not found" }, { status: 401 });
		}

		const githubAPI = createGitHubAPI();

		if (key) {
			// Clear specific cache entry
			githubAPI.clearCacheEntry(key);
			return NextResponse.json({
				message: `Cleared cache for key: ${key}`,
				timestamp: new Date().toISOString(),
			});
		} else {
			// Clear all cache
			githubAPI.clearCache();
			return NextResponse.json({
				message: "Cleared all cache",
				timestamp: new Date().toISOString(),
			});
		}
	} catch (error) {
		console.error("Error clearing cache:", error);
		return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 });
	}
}
