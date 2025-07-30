import { createGitHubAPI } from "@/lib/github-api";
import { formatGitHubTopics, sortTopicsByPriority } from "@/lib/github-topics";
import { NextResponse } from "next/server";

// interface GitHubRepo {
// 	name: string;
// 	full_name: string;
// 	description: string | null;
// 	html_url: string;
// 	stargazers_count: number;
// 	forks_count: number;
// 	language: string | null;
// 	updated_at: string;
// 	homepage: string | null;
// 	topics: string[];
// }

interface ProjectData {
	title: string;
	repoName: string;
	description: string;
	tags: string[];
	image: string;
	demoUrl?: string;
	repoUrl: string;
	stars: number;
	forks: number;
	language: string | null;
	languages: { [key: string]: number };
	lastUpdated: string;
	isFromGitHub: boolean;
}

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
		const githubToken =
			process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;

		console.log("GitHub token found:", githubToken ? "Yes" : "No");
		console.log("Environment variables:", {
			NEXTJS_ENV: process.env.NEXTJS_ENV,
			NODE_ENV: process.env.NODE_ENV,
			hasGitHubToken: !!githubToken,
		});

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
		const githubAPI = createGitHubAPI(githubToken);

		// Log cache statistics
		const cacheStats = githubAPI.getCacheStats();
		console.log("📊 Cache stats:", cacheStats);

		const projectsData: ProjectData[] = [];

		for (const project of PROJECTS) {
			try {
				console.log(`📦 Processing repository: ${project.repoName}`);

				// Fetch repository data with caching
				const repoData = await githubAPI.getRepository(project.repoName);
				console.log(`✅ Successfully fetched ${project.repoName}: ${repoData.stargazers_count} stars`);

				// Fetch languages with caching
				const languages = await githubAPI.getRepositoryLanguages(project.repoName);
				console.log(`🌐 Languages for ${project.repoName}:`, Object.keys(languages));

				// Use GitHub topics if available, otherwise use fallback tags
				let tags: string[];
				if (repoData.topics && repoData.topics.length > 0) {
					const formattedTopics = formatGitHubTopics(repoData.topics);
					tags = sortTopicsByPriority(formattedTopics);
					console.log(`🏷️ Topics for ${project.repoName}:`, repoData.topics);
				} else {
					tags = project.fallbackTags;
					console.log(`📝 Using fallback tags for ${project.repoName}:`, project.fallbackTags);
				}

				projectsData.push({
					...project,
					tags,
					repoUrl: repoData.html_url,
					stars: repoData.stargazers_count,
					forks: repoData.forks_count,
					language: repoData.language,
					languages,
					lastUpdated: repoData.updated_at,
					demoUrl: project.demoUrl || repoData.homepage || undefined,
					isFromGitHub: repoData.topics && repoData.topics.length > 0,
				});
			} catch (error) {
				console.error(
					`❌ Error processing ${project.repoName}:`,
					error instanceof Error ? error.message : error,
				);
				// Use fallback data
				projectsData.push({
					...project,
					tags: project.fallbackTags,
					repoUrl: `https://github.com/${project.repoName}`,
					stars: 0,
					forks: 0,
					language: null,
					languages: {},
					lastUpdated: new Date().toISOString(),
					isFromGitHub: false,
				});
			}
		}

		// Log final cache statistics
		const finalCacheStats = githubAPI.getCacheStats();
		console.log("📊 Final cache stats:", finalCacheStats);

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
