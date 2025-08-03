import { NextResponse } from "next/server";

import { createGitHubAPI } from "@/lib/github-api";
import { formatGitHubTopics, sortTopicsByPriority } from "@/lib/github-topics";

const PROJECTS = [
	{
		title: "Modern Portfolio",
		repoName: "xirothedev/modern-portfolio",
		description:
			"A visually stunning, modern portfolio website built with Next.js 15, Tailwind CSS, and TypeScript. Features animated UI, project showcases, and seamless integration with GitHub for dynamic project data.",
		fallbackTags: ["Next.js", "TypeScript", "Tailwind CSS", "Portfolio", "GitHub API"],
		image: "/repositories/modern-portfolio.png",
		demoUrl: "https://xiro-portfolio.vercel.app",
	},
	{
		title: "Discord.js Template v14",
		repoName: "xirothedev/discord.js-template-v14",
		description:
			"A robust template for rapid development of Discord bots with multi-language support, modular command/event handling, and PostgreSQL integration.",
		fallbackTags: ["TypeScript", "Discord.js", "PostgreSQL", "Node.js"],
		image: "/repositories/discord.js-template-v14.png",
		demoUrl: "https://v0-cyberpunk-server-dashboard.vercel.app",
	},
	{
		title: "Discord Bot Dashboard",
		repoName: "xirothedev/discord-bot-dashboard",
		description:
			"A modern, intuitive platform for managing Discord bots with real-time monitoring and powerful customization features.",
		fallbackTags: ["TypeScript", "React", "Next.js", "Discord API"],
		image: "/repositories/discord-bot-dashboard.png",
		demoUrl: "https://github.com/xirothedev/discord-bot-dashboard",
	},
	{
		title: "Xiro Discord Music Bot",
		repoName: "xirothedev/xiro-discord-bot-music",
		description:
			"A robust, extensible Discord music bot supporting YouTube, Spotify, Apple Music, SoundCloud with advanced playlist management and audio filters.",
		fallbackTags: ["TypeScript", "Discord.js", "Music API", "Audio Processing"],
		image: "/repositories/xiro-discord-bot-music.png",
		demoUrl: "https://github.com/xirothedev/xiro-discord-bot-music",
	},
	{
		title: "Next.js 15 Template",
		repoName: "xirothedev/next-15-template",
		description:
			"A modern, opinionated template for building scalable web applications with Next.js 15, providing best practices and optimized configuration.",
		fallbackTags: ["Next.js", "TypeScript", "Tailwind CSS", "Best Practices"],
		image: "/repositories/next-15-template.png",
		demoUrl: "https://github.com/xirothedev/next-15-template",
	},
];

export async function GET() {
	try {
		// Try multiple sources for GitHub token
		const githubToken = process.env.GITHUB_TOKEN;
		if (!githubToken) {
			console.warn("GitHub token not found, using fallback data");
			return NextResponse.json({
				projects: PROJECTS.map((project) => ({
					...project,
					tags: project.fallbackTags,
					repoUrl: `https://github.com/${project.repoName}`,
					stars: 0,
					forks: 0,
					language: null,
					languages: {},
					lastUpdated: new Date().toISOString(),
					isFromGitHub: false,
				})),
			});
		}

		// Create GitHub API instance with caching
		const githubAPI = createGitHubAPI();

		// Log cache statistics
		const cacheStats = githubAPI.getCacheStats();
		console.log("📊 Cache stats:", cacheStats);

		// Parallelize API calls for better performance
		const projectPromises = PROJECTS.map(async (project) => {
			try {
				// Fetch repository data and languages in parallel
				const [{ data }, languages] = await Promise.all([
					githubAPI.getRepository(project.repoName),
					githubAPI.getRepositoryLanguages(project.repoName),
				]);

				let tags: string[];
				if (data.topics && data.topics.length > 0) {
					const formattedTopics = formatGitHubTopics(data.topics);
					tags = sortTopicsByPriority(formattedTopics);
				} else {
					tags = project.fallbackTags;
				}

				return {
					...project,
					tags,
					repoUrl: data.html_url,
					stars: data.stargazers_count,
					forks: data.forks_count,
					language: data.language,
					languages,
					lastUpdated: data.updated_at,
					demoUrl: project.demoUrl || data.homepage || undefined,
					isFromGitHub: data.topics && data.topics.length > 0,
				};
			} catch (error) {
				console.error(
					`❌ Error processing ${project.repoName}:`,
					error instanceof Error ? error.message : error,
				);
				// Use fallback data
				return {
					...project,
					tags: project.fallbackTags,
					repoUrl: `https://github.com/${project.repoName}`,
					stars: 0,
					forks: 0,
					language: null,
					languages: {},
					lastUpdated: new Date().toISOString(),
					isFromGitHub: false,
				};
			}
		});

		// Wait for all promises to resolve
		const projectsData = await Promise.all(projectPromises);

		return NextResponse.json({ projects: projectsData });
	} catch (error) {
		console.error("Error in GitHub API route:", error instanceof Error ? error.message : error);
		return NextResponse.json(
			{
				error: "Failed to fetch GitHub data",
				projects: PROJECTS.map((project) => ({
					...project,
					tags: project.fallbackTags,
					repoUrl: `https://github.com/${project.repoName}`,
					stars: 0,
					forks: 0,
					language: null,
					languages: {},
					lastUpdated: new Date().toISOString(),
					isFromGitHub: false,
				})),
			},
			{ status: 500 },
		);
	}
}
