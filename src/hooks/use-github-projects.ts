import useSWR from "swr";
import { cacheKeys, swrConfig } from "@/lib/swr-config";

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

interface GitHubAPIResponse {
	projects: ProjectData[];
	error?: string;
}

interface UseGitHubProjectsReturn {
	projects: ProjectData[];
	loading: boolean;
	error: string | null;
	isValidating: boolean;
	mutate: () => Promise<GitHubAPIResponse | undefined>;
}

export function useGitHubProjects(): UseGitHubProjectsReturn {
	const { data, error, isLoading, isValidating, mutate } = useSWR<GitHubAPIResponse>(
		cacheKeys.githubProjects,
		swrConfig,
	);

	// Transform the data and handle different states
	const projects = data?.projects || [];
	const errorMessage = error?.message || data?.error || null;

	// Enhanced logging for debugging
	if (process.env.NODE_ENV === "development") {
		console.log("GitHub Projects Hook State:", {
			hasData: !!data,
			projectsCount: projects.length,
			isLoading,
			isValidating,
			error: errorMessage,
			cacheKey: cacheKeys.githubProjects,
		});
	}

	return {
		projects,
		loading: isLoading,
		error: errorMessage,
		isValidating,
		mutate,
	};
}

// Additional hook for individual project data (if needed in the future)
export function useGitHubProject(repoName: string) {
	const { data, error, isLoading, isValidating, mutate } = useSWR<ProjectData>(
		repoName ? cacheKeys.githubProject(repoName) : null,
		swrConfig,
	);

	return {
		project: data,
		loading: isLoading,
		error: error?.message || null,
		isValidating,
		mutate,
	};
}

// Hook for manual cache management
export function useGitHubProjectsCache() {
	const { mutate } = useSWR(cacheKeys.githubProjects);

	const refreshProjects = async () => {
		console.log("🔄 Manually refreshing GitHub projects...");
		return mutate();
	};

	const clearCache = async () => {
		console.log("🗑️ Clearing GitHub projects cache...");
		return mutate(undefined, { revalidate: false });
	};

	const updateProject = async (repoName: string, updatedData: Partial<ProjectData>) => {
		console.log(`🔄 Updating project cache for ${repoName}...`);

		return mutate(
			(currentData: GitHubAPIResponse | undefined) => {
				if (!currentData?.projects) return currentData;

				const updatedProjects = currentData.projects.map((project: ProjectData) =>
					project.repoName === repoName ? { ...project, ...updatedData } : project,
				);

				return {
					...currentData,
					projects: updatedProjects,
				};
			},
			{ revalidate: false },
		);
	};

	return {
		refreshProjects,
		clearCache,
		updateProject,
	};
}
