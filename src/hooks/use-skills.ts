import useSWR from "swr";

import { SkillData } from "@/lib/skills-mapper";

interface SkillsAPIResponse {
	skills: SkillData[];
	metadata?: {
		username: string;
		totalRepositories: number;
		totalSkills: number;
		totalProjects: number;
		excludesForks?: boolean;
		cacheStats?: any;
	};
	error?: string;
	details?: string;
}

interface UseSkillsReturn {
	skills: SkillData[];
	loading: boolean;
	error: string | null;
	isValidating: boolean;
	metadata?: SkillsAPIResponse["metadata"];
	mutate: () => Promise<SkillsAPIResponse | undefined>;
}

const fetcher = async (url: string): Promise<SkillsAPIResponse> => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};

export function useSkills(username?: string): UseSkillsReturn {
	const url = username ? `/api/skills?username=${username}` : "/api/skills";

	const { data, error, isLoading, isValidating, mutate } = useSWR<SkillsAPIResponse>(url, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		refreshInterval: 0, // Don't auto-refresh since GitHub data doesn't change frequently
		dedupingInterval: 60000, // Dedupe requests within 1 minute
	});

	// Transform the data and handle different states
	const skills = data?.skills || [];
	const errorMessage = error?.message || data?.error || null;

	return {
		skills,
		loading: isLoading,
		error: errorMessage,
		isValidating,
		metadata: data?.metadata,
		mutate,
	};
}

// Hook for manual cache management
export function useSkillsCache(username?: string) {
	const url = username ? `/api/skills?username=${username}` : "/api/skills";
	const { mutate } = useSWR(url);

	const refreshSkills = async () => {
		console.log("🔄 Manually refreshing skills data...");
		return mutate();
	};

	const clearCache = async () => {
		console.log("🗑️ Clearing skills cache...");
		return mutate(undefined, { revalidate: false });
	};

	return {
		refreshSkills,
		clearCache,
	};
}
