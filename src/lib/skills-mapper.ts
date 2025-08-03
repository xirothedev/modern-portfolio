import { RestEndpointMethodTypes } from "@octokit/rest";

type Repository = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][0];

export interface SkillData {
	name: string;
	type: string;
	color: string;
	projects: ProjectData[];
}

export interface ProjectData {
	name: string;
	description: string;
	demoUrl?: string;
	repoUrl: string;
	stars: number;
	forks: number;
	language: string | null;
	lastUpdated: string;
	private: boolean;
}

// Skill mapping configuration
const SKILL_MAPPINGS: Record<
	string,
	{
		type: string;
		color: string;
		keywords: string[];
		languages: string[];
		topics: string[];
	}
> = {
	// Programming Languages
	JavaScript: {
		type: "Programming Language",
		color: "bg-yellow-500",
		keywords: ["javascript", "js", "node", "npm"],
		languages: ["JavaScript"],
		topics: ["javascript", "js", "nodejs", "node", "npm", "yarn", "webpack", "babel"],
	},
	TypeScript: {
		type: "Programming Language",
		color: "bg-blue-600",
		keywords: ["typescript", "ts"],
		languages: ["TypeScript"],
		topics: ["typescript", "ts", "types", "type-safety"],
	},
	// Python: {
	//   type: "Programming Language",
	//   color: "bg-green-600",
	//   keywords: ["python", "py", "django", "flask", "fastapi"],
	//   languages: ["Python"],
	//   topics: ["python", "django", "flask", "fastapi", "pandas", "numpy", "machine-learning", "ai"],
	// },
	// Java: {
	//   type: "Programming Language",
	//   color: "bg-red-600",
	//   keywords: ["java", "spring", "maven", "gradle"],
	//   languages: ["Java"],
	//   topics: ["java", "spring", "spring-boot", "maven", "gradle", "android"],
	// },
	// "C#": {
	//   type: "Programming Language",
	//   color: "bg-purple-600",
	//   keywords: ["csharp", "c#", "dotnet", ".net"],
	//   languages: ["C#"],
	//   topics: ["csharp", "dotnet", "asp-net", "unity", "xamarin"],
	// },
	// Go: {
	//   type: "Programming Language",
	//   color: "bg-cyan-600",
	//   keywords: ["go", "golang"],
	//   languages: ["Go"],
	//   topics: ["go", "golang", "goroutines", "microservices"],
	// },
	// Rust: {
	//   type: "Programming Language",
	//   color: "bg-orange-600",
	//   keywords: ["rust", "cargo"],
	//   languages: ["Rust"],
	//   topics: ["rust", "cargo", "systems-programming", "webassembly"],
	// },
	// PHP: {
	//   type: "Programming Language",
	//   color: "bg-indigo-600",
	//   keywords: ["php", "laravel", "symfony", "composer"],
	//   languages: ["PHP"],
	//   topics: ["php", "laravel", "symfony", "wordpress", "composer"],
	// },

	// Frontend Frameworks
	React: {
		type: "Frontend Framework",
		color: "bg-cyan-500",
		keywords: ["react", "jsx", "hooks"],
		languages: ["JavaScript", "TypeScript"],
		topics: ["react", "reactjs", "jsx", "hooks", "redux", "next", "gatsby"],
	},
	"Next.js": {
		type: "Frontend Framework",
		color: "bg-black",
		keywords: ["next", "nextjs"],
		languages: ["JavaScript", "TypeScript"],
		topics: ["nextjs", "next", "ssr", "static-site", "vercel"],
	},
	// Vue: {
	//   type: "Frontend Framework",
	//   color: "bg-green-500",
	//   keywords: ["vue", "vuejs", "nuxt"],
	//   languages: ["JavaScript", "TypeScript"],
	//   topics: ["vue", "vuejs", "nuxt", "composition-api"],
	// },
	// Angular: {
	//   type: "Frontend Framework",
	//   color: "bg-red-500",
	//   keywords: ["angular", "ng"],
	//   languages: ["TypeScript"],
	//   topics: ["angular", "angular2", "rxjs", "ngrx"],
	// },
	// Svelte: {
	//   type: "Frontend Framework",
	//   color: "bg-orange-500",
	//   keywords: ["svelte", "sveltekit"],
	//   languages: ["JavaScript", "TypeScript"],
	//   topics: ["svelte", "sveltekit", "compiler"],
	// },

	// Backend & Runtime
	"Node.js": {
		type: "JavaScript Runtime",
		color: "bg-green-600",
		keywords: ["node", "nodejs", "npm", "express"],
		languages: ["JavaScript", "TypeScript"],
		topics: ["nodejs", "node", "express", "koa", "fastify", "npm", "yarn"],
	},
	Express: {
		type: "Backend Framework",
		color: "bg-gray-600",
		keywords: ["express", "expressjs"],
		languages: ["JavaScript", "TypeScript"],
		topics: ["express", "expressjs", "middleware", "api"],
	},
	// Django: {
	//   type: "Backend Framework",
	//   color: "bg-green-700",
	//   keywords: ["django"],
	//   languages: ["Python"],
	//   topics: ["django", "python", "orm", "mvc"],
	// },
	// Flask: {
	//   type: "Backend Framework",
	//   color: "bg-blue-700",
	//   keywords: ["flask"],
	//   languages: ["Python"],
	//   topics: ["flask", "python", "microframework", "api"],
	// },
	// "Spring Boot": {
	//   type: "Backend Framework",
	//   color: "bg-green-800",
	//   keywords: ["spring", "spring-boot"],
	//   languages: ["Java"],
	//   topics: ["spring", "spring-boot", "java", "microservices"],
	// },

	// CSS & Styling
	"Tailwind CSS": {
		type: "CSS Framework",
		color: "bg-teal-500",
		keywords: ["tailwind", "tailwindcss"],
		languages: ["CSS"],
		topics: ["tailwindcss", "tailwind", "utility-first", "css"],
	},
	// Bootstrap: {
	//   type: "CSS Framework",
	//   color: "bg-purple-500",
	//   keywords: ["bootstrap"],
	//   languages: ["CSS"],
	//   topics: ["bootstrap", "responsive", "css", "ui"],
	// },
	Sass: {
		type: "CSS Preprocessor",
		color: "bg-pink-500",
		keywords: ["sass", "scss"],
		languages: ["SCSS", "Sass"],
		topics: ["sass", "scss", "css", "preprocessor"],
	},

	// Databases
	PostgreSQL: {
		type: "Database",
		color: "bg-blue-700",
		keywords: ["postgres", "postgresql", "pg"],
		languages: ["SQL", "PLpgSQL"],
		topics: ["postgresql", "postgres", "sql", "database", "relational"],
	},
	MySQL: {
		type: "Database",
		color: "bg-blue-600",
		keywords: ["mysql"],
		languages: ["SQL"],
		topics: ["mysql", "sql", "database", "mariadb"],
	},
	MongoDB: {
		type: "Database",
		color: "bg-green-500",
		keywords: ["mongo", "mongodb"],
		languages: ["JavaScript"],
		topics: ["mongodb", "mongo", "nosql", "database", "document"],
	},
	Redis: {
		type: "Database",
		color: "bg-red-500",
		keywords: ["redis"],
		languages: [],
		topics: ["redis", "cache", "in-memory", "database"],
	},

	// DevOps & Tools
	Docker: {
		type: "Containerization",
		color: "bg-blue-500",
		keywords: ["docker", "dockerfile", "container"],
		languages: ["Dockerfile"],
		topics: ["docker", "containerization", "devops", "kubernetes"],
	},
	// Kubernetes: {
	//   type: "Container Orchestration",
	//   color: "bg-blue-400",
	//   keywords: ["kubernetes", "k8s", "kubectl"],
	//   languages: ["YAML"],
	//   topics: ["kubernetes", "k8s", "orchestration", "devops", "cloud"],
	// },
	Git: {
		type: "Version Control System",
		color: "bg-red-500",
		keywords: ["git", "github", "gitlab"],
		languages: [],
		topics: ["git", "version-control", "github", "gitlab", "vcs"],
	},
	// AWS: {
	//   type: "Cloud Platform",
	//   color: "bg-orange-500",
	//   keywords: ["aws", "amazon", "lambda", "s3", "ec2"],
	//   languages: [],
	//   topics: ["aws", "amazon-web-services", "cloud", "lambda", "s3", "ec2"],
	// },

	// Query Languages & APIs
	GraphQL: {
		type: "Query Language",
		color: "bg-pink-500",
		keywords: ["graphql", "apollo", "relay"],
		languages: ["GraphQL"],
		topics: ["graphql", "apollo", "relay", "api", "query"],
	},
	REST: {
		type: "API Architecture",
		color: "bg-blue-500",
		keywords: ["rest", "api", "restful"],
		languages: [],
		topics: ["rest", "api", "restful", "http", "json"],
	},

	// Testing
	Jest: {
		type: "Testing Framework",
		color: "bg-red-400",
		keywords: ["jest", "testing"],
		languages: ["JavaScript", "TypeScript"],
		topics: ["jest", "testing", "unit-testing", "javascript"],
	},
	// Cypress: {
	//   type: "Testing Framework",
	//   color: "bg-green-400",
	//   keywords: ["cypress", "e2e"],
	//   languages: ["JavaScript", "TypeScript"],
	//   topics: ["cypress", "e2e", "testing", "automation"],
	// },
};

export function mapRepositoriesToSkills(
	repositories: Repository[],
	languagesData: Record<string, Record<string, number>> = {},
): SkillData[] {
	const skillsMap = new Map<string, SkillData>();

	// Initialize skills map
	Object.entries(SKILL_MAPPINGS).forEach(([skillName, config]) => {
		skillsMap.set(skillName, {
			name: skillName,
			type: config.type,
			color: config.color,
			projects: [],
		});
	});

	// Process each repository
	repositories.forEach((repo) => {
		const repoLanguages = languagesData[repo.full_name] || {};
		const repoTopics = repo.topics || [];
		const repoName = repo.name.toLowerCase();
		const repoDescription = (repo.description || "").toLowerCase();

		// Create project data
		const projectData: ProjectData = {
			name: repo.name,
			description: repo.description || "No description available",
			demoUrl: repo.homepage || undefined,
			repoUrl: repo.html_url,
			stars: repo.stargazers_count ?? 0,
			forks: repo.forks_count ?? 0,
			language: repo.language ?? null,
			lastUpdated: repo.updated_at ?? new Date().toISOString(),
			private: repo.private ?? false,
		};

		// Match repository to skills
		Object.entries(SKILL_MAPPINGS).forEach(([skillName, config]) => {
			let matches = false;

			// Check primary language
			if (repo.language && config.languages.includes(repo.language)) {
				matches = true;
			}

			// Check repository languages
			if (Object.keys(repoLanguages).some((lang) => config.languages.includes(lang))) {
				matches = true;
			}

			// Check topics
			if (repoTopics.some((topic) => config.topics.includes(topic.toLowerCase()))) {
				matches = true;
			}

			// Check keywords in name and description
			if (config.keywords.some((keyword) => repoName.includes(keyword) || repoDescription.includes(keyword))) {
				matches = true;
			}

			// Add project to skill if it matches
			if (matches) {
				const skill = skillsMap.get(skillName);
				if (skill) {
					// Avoid duplicates
					const existingProject = skill.projects.find((p) => p.repoUrl === projectData.repoUrl);
					if (!existingProject) {
						skill.projects.push(projectData);
					}
				}
			}
		});
	});

	// Filter out skills with no projects and sort projects by stars
	const skillsWithProjects = Array.from(skillsMap.values())
		.filter((skill) => skill.projects.length > 0)
		.map((skill) => ({
			...skill,
			projects: skill.projects
				.sort((a, b) => b.stars - a.stars) // Sort by stars descending
				.slice(0, 10), // Limit to top 10 projects per skill
		}))
		.sort((a, b) => b.projects.length - a.projects.length); // Sort skills by number of projects

	return skillsWithProjects;
}

export function getSkillColor(skillName: string): string {
	const skill = SKILL_MAPPINGS[skillName as keyof typeof SKILL_MAPPINGS];
	return skill?.color || "bg-gray-500";
}

export function getSkillType(skillName: string): string {
	const skill = SKILL_MAPPINGS[skillName as keyof typeof SKILL_MAPPINGS];
	return skill?.type || "Technology";
}

export { SKILL_MAPPINGS };
