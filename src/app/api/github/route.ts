import { NextResponse } from "next/server";
import { formatGitHubTopics, sortTopicsByPriority } from "@/lib/github-topics";

interface GitHubRepo {
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	stargazers_count: number;
	forks_count: number;
	language: string | null;
	updated_at: string;
	homepage: string | null;
	topics: string[];
}

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
				})),
			});
		}

		const projectsData: ProjectData[] = [];

		for (const project of PROJECTS) {
			try {
				const response = await fetch(`https://api.github.com/repos/${project.repoName}`, {
					headers: {
						Authorization: `token ${githubToken}`,
						Accept: "application/vnd.github.v3+json",
					},
					next: { revalidate: 3600 }, // Cache for 1 hour
				});

				if (!response.ok) {
					console.warn(`Failed to fetch ${project.repoName}: ${response.status}`);
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
					continue;
				}

				const repoData: GitHubRepo = await response.json();

				// Fetch languages for the repository
				let languages: { [key: string]: number } = {};
				try {
					const languagesResponse = await fetch(
						`https://api.github.com/repos/${project.repoName}/languages`,
						{
							headers: {
								Authorization: `token ${githubToken}`,
								Accept: "application/vnd.github.v3+json",
							},
							next: { revalidate: 3600 }, // Cache for 1 hour
						},
					);

					if (languagesResponse.ok) {
						languages = await languagesResponse.json();
					}
				} catch (error) {
					console.warn(`Failed to fetch languages for ${project.repoName}:`, error);
				}

				// Use GitHub topics if available, otherwise use fallback tags
				let tags: string[];
				if (repoData.topics && repoData.topics.length > 0) {
					const formattedTopics = formatGitHubTopics(repoData.topics);
					tags = sortTopicsByPriority(formattedTopics);
				} else {
					tags = project.fallbackTags;
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
				console.error(`Error fetching ${project.repoName}:`, error);
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

		return NextResponse.json({ projects: projectsData });
	} catch (error) {
		console.error("Error in GitHub API route:", error);
		return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
	}
}
