import { NextResponse } from "next/server";

import { createGitHubAPI } from "@/lib/github-api";
import { mapRepositoriesToSkills } from "@/lib/skills-mapper";

const DEFAULT_USERNAME = "xirothedev"; // Default GitHub username

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const username = searchParams.get("username") || DEFAULT_USERNAME;

		// Check for GitHub token
		const githubToken = process.env.GITHUB_TOKEN;
		if (!githubToken) {
			console.warn("GitHub token not found, cannot fetch real repository data");
			return NextResponse.json(
				{
					error: "GitHub token not configured",
					skills: [],
				},
				{ status: 500 },
			);
		}

		// Create GitHub API instance
		const githubAPI = createGitHubAPI();

		console.log(`🔍 Fetching repositories for user: ${username}`);

		// Fetch all repositories for the user (excluding forks)
		const repositories = await githubAPI.getAllUserRepositories(username);

		console.log(`📦 Found ${repositories.length} original repositories for ${username} (forks excluded)`);

		// Fetch languages for each repository (in batches to avoid rate limits)
		const languagesData: Record<string, Record<string, number>> = {};
		const batchSize = 5;

		for (let i = 0; i < repositories.length; i += batchSize) {
			const batch = repositories.slice(i, i + batchSize);
			const languagePromises = batch.map(async (repo) => {
				try {
					const languages = await githubAPI.getRepositoryLanguages(repo.full_name);
					return { repoName: repo.full_name, languages };
				} catch (error) {
					console.warn(`Failed to fetch languages for ${repo.full_name}:`, error);
					return { repoName: repo.full_name, languages: {} };
				}
			});

			const batchResults = await Promise.all(languagePromises);
			batchResults.forEach(({ repoName, languages }) => {
				languagesData[repoName] = languages;
			});

			// Add a small delay between batches to respect rate limits
			if (i + batchSize < repositories.length) {
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		}

		console.log(`🔤 Fetched languages for ${Object.keys(languagesData).length} repositories`);

		// Map repositories to skills
		const skills = mapRepositoriesToSkills(repositories, languagesData);

		console.log(`🎯 Mapped repositories to ${skills.length} skills`);

		// Log cache statistics
		const cacheStats = githubAPI.getCacheStats();
		console.log("📊 Cache stats:", cacheStats);

		return NextResponse.json({
			skills,
			metadata: {
				username,
				totalRepositories: repositories.length,
				totalSkills: skills.length,
				totalProjects: skills.reduce((sum, skill) => sum + skill.projects.length, 0),
				excludesForks: true,
				cacheStats,
			},
		});
	} catch (error) {
		console.error("Error in skills API route:", error instanceof Error ? error.message : error);

		return NextResponse.json(
			{
				error: "Failed to fetch skills data",
				skills: [],
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
