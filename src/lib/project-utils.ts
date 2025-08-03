/**
 * Utility functions for handling project data
 */

export interface ProjectData {
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

/**
 * Generate a URL-friendly slug from project title or repo name
 */
export function generateProjectSlug(project: ProjectData): string {
	// Use repo name as primary source for slug since it's more stable
	const baseSlug = project.repoName || project.title;

	return baseSlug
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
		.replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
		.replace(/-+/g, "-"); // Replace multiple hyphens with single
}

/**
 * Find a project by its slug
 */
export function findProjectBySlug(projects: ProjectData[], slug: string): ProjectData | undefined {
	return projects.find((project) => generateProjectSlug(project) === slug);
}

/**
 * Get related projects based on shared tags
 */
export function getRelatedProjects(
	currentProject: ProjectData,
	allProjects: ProjectData[],
	limit: number = 3,
): ProjectData[] {
	const currentSlug = generateProjectSlug(currentProject);

	// Calculate similarity score based on shared tags
	const projectsWithScore = allProjects
		.filter((project) => generateProjectSlug(project) !== currentSlug)
		.map((project) => {
			const sharedTags = project.tags.filter((tag) => currentProject.tags.includes(tag));
			const score = sharedTags.length;
			return { project, score };
		})
		.filter((item) => item.score > 0) // Only include projects with shared tags
		.sort((a, b) => b.score - a.score); // Sort by similarity score

	return projectsWithScore.slice(0, limit).map((item) => item.project);
}

/**
 * Format the last updated date
 */
export function formatLastUpdated(dateString: string): string {
	try {
		const date = new Date(dateString);
		const now = new Date();
		const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) {
			return "Updated today";
		} else if (diffInDays === 1) {
			return "Updated yesterday";
		} else if (diffInDays < 7) {
			return `Updated ${diffInDays} days ago`;
		} else if (diffInDays < 30) {
			const weeks = Math.floor(diffInDays / 7);
			return `Updated ${weeks} week${weeks > 1 ? "s" : ""} ago`;
		} else if (diffInDays < 365) {
			const months = Math.floor(diffInDays / 30);
			return `Updated ${months} month${months > 1 ? "s" : ""} ago`;
		} else {
			const years = Math.floor(diffInDays / 365);
			return `Updated ${years} year${years > 1 ? "s" : ""} ago`;
		}
	} catch {
		return "Recently updated";
	}
}

/**
 * Get the dominant language from languages object
 */
export function getDominantLanguage(languages: { [key: string]: number }): string | null {
	const entries = Object.entries(languages);
	if (entries.length === 0) return null;

	// Sort by percentage and return the highest
	const sorted = entries.sort(([, a], [, b]) => b - a);
	return sorted[0][0];
}

/**
 * Calculate total lines of code from languages object
 */
export function getTotalLinesOfCode(languages: { [key: string]: number }): number {
	return Object.values(languages).reduce((total, lines) => total + lines, 0);
}

/**
 * Sort projects by different criteria
 */
export function sortProjects(
	projects: ProjectData[],
	sortBy: "stars" | "updated" | "name" | "forks" = "stars",
): ProjectData[] {
	return [...projects].sort((a, b) => {
		switch (sortBy) {
			case "stars":
				return b.stars - a.stars;
			case "forks":
				return b.forks - a.forks;
			case "updated":
				return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
			case "name":
				return a.title.localeCompare(b.title);
			default:
				return 0;
		}
	});
}

/**
 * Filter projects by criteria
 */
export function filterProjects(
	projects: ProjectData[],
	filters: {
		search?: string;
		tags?: string[];
		language?: string;
		hasDemo?: boolean;
		minStars?: number;
	},
): ProjectData[] {
	return projects.filter((project) => {
		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			const matchesSearch =
				project.title.toLowerCase().includes(searchLower) ||
				project.description.toLowerCase().includes(searchLower) ||
				project.tags.some((tag) => tag.toLowerCase().includes(searchLower));

			if (!matchesSearch) return false;
		}

		// Tags filter
		if (filters.tags && filters.tags.length > 0) {
			const hasMatchingTag = filters.tags.some((tag) => project.tags.includes(tag));
			if (!hasMatchingTag) return false;
		}

		// Language filter
		if (filters.language && project.language !== filters.language) {
			return false;
		}

		// Demo URL filter
		if (filters.hasDemo && (!project.demoUrl || project.demoUrl === "#")) {
			return false;
		}

		// Minimum stars filter
		if (filters.minStars && project.stars < filters.minStars) {
			return false;
		}

		return true;
	});
}

/**
 * Get project statistics
 */
export function getProjectStats(projects: ProjectData[]) {
	const totalProjects = projects.length;
	const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
	const totalForks = projects.reduce((sum, project) => sum + project.forks, 0);
	const projectsWithDemo = projects.filter((p) => p.demoUrl && p.demoUrl !== "#").length;

	const languages = new Set(projects.map((p) => p.language).filter(Boolean));
	const allTags = new Set(projects.flatMap((p) => p.tags));

	return {
		totalProjects,
		totalStars,
		totalForks,
		projectsWithDemo,
		uniqueLanguages: languages.size,
		uniqueTags: allTags.size,
		averageStars: totalProjects > 0 ? Math.round(totalStars / totalProjects) : 0,
	};
}
