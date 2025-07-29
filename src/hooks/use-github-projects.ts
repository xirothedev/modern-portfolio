import { useState, useEffect } from "react";

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

interface UseGitHubProjectsReturn {
	projects: ProjectData[];
	loading: boolean;
	error: string | null;
}

export function useGitHubProjects(): UseGitHubProjectsReturn {
	const [projects, setProjects] = useState<ProjectData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch("/api/github");

				if (!response.ok) {
					throw new Error("Failed to fetch projects");
				}

				const data = await response.json();
				setProjects(data.projects || []);
			} catch (err) {
				console.error("Error fetching GitHub projects:", err);
				setError(err instanceof Error ? err.message : "Failed to fetch projects");
			} finally {
				setLoading(false);
			}
		};

		fetchProjects();
	}, []);

	return { projects, loading, error };
}
