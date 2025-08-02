import { RestEndpointMethodTypes } from "@octokit/rest";

export type RepositoryResult = {
	data: RestEndpointMethodTypes["repos"]["get"]["response"]["data"];
	wasRenamed: boolean;
	originalName?: string;
	newName?: string;
} | null;

export type MultipleRepositoriesResponse = Map<string, RepositoryResult>;

export type MultipleRepositoriesReport = {
	results: MultipleRepositoriesResponse;
	summary: {
		total: number;
		successful: number;
		failed: number;
		renamed: number;
		renamedRepos: Array<{ original: string; new: string }>;
		errors: Array<{ repoName: string; error: string }>;
	};
};
