// GitHub topics formatting utility
export function formatGitHubTopics(topics: string[]): string[] {
	if (!topics || topics.length === 0) return [];

	return topics
		.map((topic) => {
			// Convert kebab-case to Title Case
			return topic
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		})
		.filter((topic) => {
			// Filter out common GitHub topics that aren't very descriptive
			const commonTopics = [
				"awesome",
				"awesome-list",
				"list",
				"curated",
				"collection",
				"hacktoberfest",
				"good-first-issue",
				"help-wanted",
				"documentation",
				"docs",
				"readme",
				"template",
				"boilerplate",
			];
			return !commonTopics.includes(topic.toLowerCase());
		})
		.slice(0, 6); // Limit to 6 topics for better UI
}

// Priority topics that should be shown first
const priorityTopics = [
	"typescript",
	"javascript",
	"react",
	"nextjs",
	"nodejs",
	"discord",
	"bot",
	"music",
	"api",
	"database",
	"postgresql",
	"mongodb",
	"docker",
	"aws",
	"vercel",
	"tailwind",
	"css",
	"html",
];

export function sortTopicsByPriority(topics: string[]): string[] {
	return topics.sort((a, b) => {
		const aPriority = priorityTopics.indexOf(a.toLowerCase());
		const bPriority = priorityTopics.indexOf(b.toLowerCase());

		// If both are priority topics, sort by priority order
		if (aPriority !== -1 && bPriority !== -1) {
			return aPriority - bPriority;
		}

		// If only one is priority, prioritize it
		if (aPriority !== -1) return -1;
		if (bPriority !== -1) return 1;

		// Otherwise, sort alphabetically
		return a.localeCompare(b);
	});
}
