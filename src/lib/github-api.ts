import { githubCache, generateCacheKey, CACHE_CONFIGS } from "./github-cache";
import { Octokit } from "octokit";

interface FetchOptions {
	cache?: boolean;
	ttl?: number;
}

class GitHubAPI {
	private token: string;
	private octokit: Octokit;

	constructor() {
		const token = process.env.GITHUB_TOKEN;
		if (!token) {
			throw new Error("GitHub token not found");
		}
		this.token = token;
		this.octokit = new Octokit({ auth: this.token });
	}

	async getRepository(repoName: string, options: FetchOptions = {}) {
		const cacheKey = generateCacheKey("repos", { repo: repoName });
		if (options.cache !== false) {
			const cached = githubCache.get(cacheKey);
			if (cached) {
				return cached;
			}
		}
		try {
			const [owner, repo] = repoName.split("/");
			const { data } = await this.octokit.rest.repos.get({ owner, repo });
			if (options.cache !== false) {
				githubCache.set(cacheKey, data, options.ttl || CACHE_CONFIGS.REPO_INFO.ttl);
			}
			return data;
		} catch (error) {
			console.error(`❌ Error fetching repository ${repoName}:`, error);
			throw error;
		}
	}

	async getRepositoryLanguages(repoName: string, options: FetchOptions = {}): Promise<Record<string, number>> {
		const cacheKey = generateCacheKey("languages", { repo: repoName });
		if (options.cache !== false) {
			const cached = githubCache.get(cacheKey);
			if (cached) {
				return cached as Record<string, number>;
			}
		}
		try {
			const [owner, repo] = repoName.split("/");
			const { data } = await this.octokit.rest.repos.listLanguages({ owner, repo });
			if (options.cache !== false) {
				githubCache.set(cacheKey, data, options.ttl || CACHE_CONFIGS.REPO_LANGUAGES.ttl);
			}
			return data;
		} catch (error) {
			console.error(
				`❌ Error fetching languages for ${repoName}:`,
				error instanceof Error ? error.message : error,
			);
			return {};
		}
	}

	async getRateLimit() {
		const cacheKey = generateCacheKey("rate_limit");
		const cached = githubCache.get(cacheKey);
		if (cached) {
			return cached;
		}
		try {
			const { data } = await this.octokit.rest.rateLimit.get();
			githubCache.set(cacheKey, data, CACHE_CONFIGS.RATE_LIMIT.ttl);
			return data;
		} catch (error) {
			console.error("❌ Error checking rate limit:", error);
			return null;
		}
	}

	async getMultipleRepositories(repoNames: string[], options: FetchOptions = {}): Promise<Map<string, unknown>> {
		const results = new Map<string, unknown>();
		for (const repoName of repoNames) {
			try {
				const repoData = await this.getRepository(repoName, options);
				results.set(repoName, repoData);
			} catch (error) {
				console.error(`Failed to fetch ${repoName}:`, error);
				results.set(repoName, null);
			}
		}
		return results;
	}

	// async addCollaborator(repoName: string, username: string, permission: "pull" | "push" | "admin" = "pull") {
	// 	const [owner, repo] = repoName.split("/");
	// 	try {
	// 		await this.octokit.rest.repos.addCollaborator({
	// 			owner,
	// 			repo,
	// 			username,
	// 			permission,
	// 		});
	//     return true;
	// 	} catch (error: any) {
	// 		// 422: already a collaborator
	// 		if (error.status === 422) return true;
	// 		console.error(`GitHub API error (addCollaborator):`, error);
	// 		throw error;
	// 	}
	// }

	async getReadonlyRepository(repoName: string, username: string) {
		const [sourceOwner, sourceRepo] = repoName.split("/");
		const targetOrg = "xirothedev-minor";

		try {
			let forkedRepo;
			try {
				const repoRes = await this.octokit.rest.repos.get({
					owner: targetOrg,
					repo: sourceRepo,
				});
				forkedRepo = repoRes.data;
			} catch (err: any) {
				if (err.status === 404) {
					const forkResponse = await this.octokit.rest.repos.createFork({
						owner: sourceOwner,
						repo: sourceRepo,
						organization: targetOrg,
					});
					await new Promise((resolve) => setTimeout(resolve, 8000));
					forkedRepo = forkResponse.data;
				} else {
					throw err;
				}
			}

			if (forkedRepo && forkedRepo.owner.login === targetOrg) {
				try {
					await this.octokit.rest.repos.mergeUpstream({
						owner: targetOrg,
						repo: sourceRepo,
						branch: forkedRepo.default_branch,
					});
				} catch (syncErr: any) {
					console.warn("Sync upstream failed or not enabled:", syncErr?.message || syncErr);
				}
			}

			await this.octokit.rest.repos.addCollaborator({
				owner: targetOrg,
				repo: sourceRepo,
				username,
				permission: "pull",
			});

			return forkedRepo;
		} catch (error: any) {
			console.error(`GitHub API error (getReadonlyRepository):`, error);
			throw error;
		}
	}

	async removeCollaborator(repoName: string, username: string) {
		const [owner, repo] = repoName.split("/");
		await this.octokit.rest.repos.removeCollaborator({
			owner,
			repo,
			username,
		});
	}

	getCacheStats() {
		return githubCache.getStats();
	}

	clearCache() {
		githubCache.clear();
	}

	clearCacheEntry(key: string) {
		githubCache.delete(key);
	}
}

export function createGitHubAPI(): GitHubAPI {
	return new GitHubAPI();
}

export async function fetchRepositoryWithFallback(
	api: GitHubAPI,
	repoName: string,
	fallbackData: NonNullable<unknown>,
) {
	try {
		const repoData = await api.getRepository(repoName);
		return {
			...fallbackData,
			...repoData,
			isFromGitHub: true,
		};
	} catch (error) {
		console.warn(`Using fallback data for ${repoName}:`, error instanceof Error ? error.message : error);
		return {
			...fallbackData,
			isFromGitHub: false,
		};
	}
}
