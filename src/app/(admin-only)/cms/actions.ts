"use server";

import { Project, RepoScope, Token } from "generated/prisma";

import { prisma } from "@/lib/db";
import { GitHubRepositoryError, createGitHubAPI } from "@/lib/github-api";
import { requireAdmin } from "@/utils/admin-protection";

import { DEFAULT_EXPIRE_TIME } from "./components/token-manager-table";

/*
 * Error Handling Documentation:
 *
 * This file handles the following error cases:
 *
 * PROJECT OPERATIONS:
 * - Repository not found on GitHub (404)
 * - Repository access denied (403) - private repo or rate limit
 * - GitHub authentication failed (401)
 * - Repository is archived/disabled
 * - Duplicate slug or repository name
 * - Invalid repository name format
 * - Project not found when updating/deleting
 * - Cannot delete project with active tokens
 *
 * TOKEN OPERATIONS:
 * - Project not found when creating token
 * - Invalid expiration date (past date)
 * - Token not found when updating/deleting
 * - Duplicate token ID
 * - Foreign key constraint violations
 *
 * DATABASE OPERATIONS:
 * - Unique constraint violations (P2002)
 * - Foreign key constraint violations (P2003)
 * - Record not found (P2025)
 * - Network/connection errors
 * - Unexpected database errors
 *
 * All functions return { success: boolean, message?: string } for consistent error handling
 */

export interface CMSStats {
	totalRepositories: number;
	activeTokens: number;
	pendingRequests: number;
	requestsThisMonth: number;
}

export async function getProjects() {
	await requireAdmin();

	try {
		const projects = await prisma.project.findMany({ orderBy: { updateAt: "desc" } });
		const githubAPI = createGitHubAPI();

		try {
			const PROJECTS = await githubAPI.getMultipleRepositories(projects.map((project) => project.repoName));

			const data = projects.map((project) => {
				const repository = PROJECTS.results.get(project.repoName) ?? null;

				return {
					project,
					repository,
				};
			});

			return {
				success: true,
				data,
			};
		} catch (error) {
			console.error("❌ Error fetching GitHub repositories:", error);

			// Return projects without GitHub data if GitHub API fails
			const data = projects.map((project) => ({
				project,
				repository: null,
			}));

			return {
				success: true,
				data,
				message: "Projects loaded but GitHub data unavailable. Some repository information may be missing.",
			};
		}
	} catch (error) {
		console.error("❌ Error fetching projects from database:", error);
		return {
			success: false,
			message: "Failed to load projects from database. Please try again.",
		};
	}
}

export async function addProject(
	data: Omit<Project, "id" | "createdAt" | "updateAt">,
): Promise<{ success: boolean; project?: Project; message?: string }> {
	await requireAdmin();

	try {
		// Input validation
		if (!data.repoName || !data.slug) {
			return { success: false, message: "Repository name and slug are required" };
		}

		// Validate repository name format
		const repoNameRegex = /^[A-Za-z0-9\._-]+\/[A-Za-z0-9\._-]+$/;
		if (!repoNameRegex.test(data.repoName)) {
			return {
				success: false,
				message: "Repository name must be in format 'owner/repo'",
			};
		}

		// Check if slug is unique (since it's the unique constraint)
		const existingSlug = await prisma.project.findUnique({
			where: { slug: data.slug },
		});
		if (existingSlug) {
			return {
				success: false,
				message: "A project with this slug already exists",
			};
		}

		// Check if repoName already exists
		const existingRepo = await prisma.project.findUnique({
			where: { repoName: data.repoName },
		});
		if (existingRepo) {
			return {
				success: false,
				message: "A project with this repository already exists",
			};
		}

		// Verify repository exists on GitHub
		let repositoryData;
		const githubAPI = createGitHubAPI();

		try {
			const res = await githubAPI.getRepository(data.repoName);
			repositoryData = res.data;
		} catch (error) {
			if (error instanceof GitHubRepositoryError) {
				switch (error.statusCode) {
					case 404:
						return {
							success: false,
							message: `Repository "${data.repoName}" not found on GitHub. Please check the repository name.`,
						};
					case 403:
						return {
							success: false,
							message: error.message.includes("rate limit")
								? "GitHub rate limit exceeded. Please try again later."
								: `Access denied to repository "${data.repoName}". The repository might be private.`,
						};
					case 401:
						return {
							success: false,
							message: "GitHub authentication failed. Please check API credentials.",
						};
					default:
						return {
							success: false,
							message: `GitHub API error: ${error.message}`,
						};
				}
			}

			// Handle network or other unexpected errors
			console.error("Unexpected error validating repository:", error);
			return {
				success: false,
				message: "Unable to verify repository. Please check your internet connection and try again.",
			};
		}

		// Additional repository validation (optional)
		if (repositoryData.archived) {
			return {
				success: false,
				message: `Repository "${data.repoName}" is archived and cannot be added.`,
			};
		}

		if (repositoryData.disabled) {
			return {
				success: false,
				message: `Repository "${data.repoName}" is disabled and cannot be added.`,
			};
		}

		// Create project with additional repository metadata
		const project = await prisma.project.create({
			data: {
				...data,
				createdAt: new Date(),
				// Optionally store additional GitHub metadata
				// githubId: repositoryData.id,
				// description: repositoryData.description,
				// starCount: repositoryData.stargazers_count,
				// language: repositoryData.language,
			},
		});

		console.log(`✅ Successfully created project for repository: ${data.repoName}`);

		return {
			success: true,
			project,
			message: `Project "${data.slug}" created successfully!`,
		};
	} catch (error: any) {
		// Handle database errors
		if (error.code === "P2002") {
			// Prisma unique constraint violation
			const target = error.meta?.target;
			if (target?.includes("slug")) {
				return {
					success: false,
					message: "A project with this slug already exists",
				};
			}
			if (target?.includes("repoName")) {
				return {
					success: false,
					message: "A project with this repository already exists",
				};
			}
		}

		// Log unexpected errors
		console.error("❌ Unexpected error in addProject:", {
			error,
			data,
			timestamp: new Date().toISOString(),
		});

		return {
			success: false,
			message: "An unexpected error occurred. Please try again.",
		};
	}
}

export async function updateProject(
	id: string,
	data: Partial<Omit<Project, "id" | "createdAt">>,
): Promise<{ success: boolean; project?: Project; message?: string }> {
	await requireAdmin();

	try {
		// Input validation
		if (!id) {
			return { success: false, message: "Project ID is required" };
		}

		if (!data || Object.keys(data).length === 0) {
			return { success: false, message: "No data provided for update" };
		}

		// Check if project exists
		const existingProject = await prisma.project.findUnique({ where: { id } });
		if (!existingProject) {
			return { success: false, message: "Project not found" };
		}

		// Validate repository name format if it's being updated
		if (data.repoName) {
			const repoNameRegex = /^[A-Za-z0-9\._-]+\/[A-Za-z0-9\._-]+$/;
			if (!repoNameRegex.test(data.repoName)) {
				return {
					success: false,
					message: "Repository name must be in format 'owner/repo'",
				};
			}
		}

		// Check for unique constraints if slug or repoName is being updated
		if (data.slug && data.slug !== existingProject.slug) {
			const existingSlug = await prisma.project.findUnique({
				where: { slug: data.slug },
			});
			if (existingSlug) {
				return {
					success: false,
					message: "A project with this slug already exists",
				};
			}
		}

		if (data.repoName && data.repoName !== existingProject.repoName) {
			const existingRepo = await prisma.project.findUnique({
				where: { repoName: data.repoName },
			});
			if (existingRepo) {
				return {
					success: false,
					message: "A project with this repository already exists",
				};
			}
		}

		// Verify repository exists on GitHub if repoName is provided (always validate)
		if (data.repoName) {
			let repositoryData;
			const githubAPI = createGitHubAPI();

			try {
				const res = await githubAPI.getRepository(data.repoName);
				repositoryData = res.data;
			} catch (error) {
				if (error instanceof GitHubRepositoryError) {
					switch (error.statusCode) {
						case 404:
							return {
								success: false,
								message: `Repository "${data.repoName}" not found on GitHub. Please check the repository name.`,
							};
						case 403:
							return {
								success: false,
								message: error.message.includes("rate limit")
									? "GitHub rate limit exceeded. Please try again later."
									: `Access denied to repository "${data.repoName}". The repository might be private.`,
							};
						case 401:
							return {
								success: false,
								message: "GitHub authentication failed. Please check API credentials.",
							};
						default:
							return {
								success: false,
								message: `GitHub API error: ${error.message}`,
							};
					}
				}

				// Handle network or other unexpected errors
				console.error("Unexpected error validating repository:", error);
				return {
					success: false,
					message: "Unable to verify repository. Please check your internet connection and try again.",
				};
			}

			// Additional repository validation (optional)
			if (repositoryData.archived) {
				return {
					success: false,
					message: `Repository "${data.repoName}" is archived and cannot be used.`,
				};
			}

			if (repositoryData.disabled) {
				return {
					success: false,
					message: `Repository "${data.repoName}" is disabled and cannot be used.`,
				};
			}

			// Optionally update additional GitHub metadata
			// data.githubId = repositoryData.id;
			// data.description = repositoryData.description;
			// data.starCount = repositoryData.stargazers_count;
			// data.language = repositoryData.language;
		}

		// Filter out undefined values and fields that shouldn't be updated
		const filteredData = Object.fromEntries(
			Object.entries(data).filter(([key, value]) => value !== undefined && !["id", "createdAt"].includes(key)),
		);

		// Update project
		const updatedProject = await prisma.project.update({
			where: { id },
			data: filteredData,
		});

		console.log(`✅ Successfully updated project: ${existingProject.slug}`);

		return {
			success: true,
			project: updatedProject,
			message: `Project "${updatedProject.slug}" updated successfully!`,
		};
	} catch (error: any) {
		// Handle database errors
		if (error.code === "P2002") {
			// Prisma unique constraint violation
			const target = error.meta?.target;
			if (target?.includes("slug")) {
				return {
					success: false,
					message: "A project with this slug already exists",
				};
			}
			if (target?.includes("repoName")) {
				return {
					success: false,
					message: "A project with this repository already exists",
				};
			}
		}

		if (error.code === "P2025") {
			// Prisma record not found
			return {
				success: false,
				message: "Project not found",
			};
		}

		// Log unexpected errors
		console.error("❌ Unexpected error in updateProject:", {
			error,
			projectId: id,
			updateData: data,
			timestamp: new Date().toISOString(),
		});

		return {
			success: false,
			message: "An unexpected error occurred while updating the project. Please try again.",
		};
	}
}

export async function deleteProject(id: string): Promise<{ success: boolean; message?: string }> {
	await requireAdmin();

	try {
		// Check if project exists
		const project = await prisma.project.findUnique({
			where: { id },
			include: { allowTokens: true },
		});

		if (!project) {
			return { success: false, message: "Project not found" };
		}

		// Check if project has active tokens
		if (project.allowTokens && project.allowTokens.length > 0) {
			const activeTokens = project.allowTokens.filter((token) => !token.isRevoked);
			if (activeTokens.length > 0) {
				return {
					success: false,
					message: `Cannot delete project "${project.slug}". It has ${activeTokens.length} active token(s). Please revoke all tokens first.`,
				};
			}
		}

		// Delete project (this will cascade delete related tokens)
		await prisma.project.delete({ where: { id } });

		console.log(`✅ Successfully deleted project: ${project.slug}`);

		return {
			success: true,
			message: `Project "${project.slug}" deleted successfully!`,
		};
	} catch (error: any) {
		console.error("❌ Error deleting project:", error);

		if (error.code === "P2025") {
			return { success: false, message: "Project not found" };
		}

		return {
			success: false,
			message: "An unexpected error occurred while deleting the project. Please try again.",
		};
	}
}

export async function getTokens(): Promise<{ success: boolean; tokens?: Token[]; message?: string }> {
	await requireAdmin();

	try {
		const tokens = await prisma.token.findMany({
			orderBy: { createdAt: "desc" },
		});
		return { success: true, tokens };
	} catch (error) {
		console.error("❌ Error fetching tokens:", error);
		return {
			success: false,
			message: "Failed to load tokens from database. Please try again.",
		};
	}
}

export async function getProjectsForSelect(): Promise<{
	success: boolean;
	projects?: { id: string; slug: string; repoName: string }[];
}> {
	await requireAdmin();

	try {
		const projects = await prisma.project.findMany({
			select: {
				id: true,
				slug: true,
				repoName: true,
			},
			orderBy: { slug: "asc" },
		});
		return { success: true, projects };
	} catch (error) {
		console.error("❌ Error fetching projects for select:", error);
		return { success: false, projects: [] };
	}
}

export async function addToken(data: {
	scope: RepoScope;
	expireAt: Date;
	projectId: string;
}): Promise<{ success: boolean; token?: Token; message?: string }> {
	await requireAdmin();

	try {
		// Input validation
		if (!data.scope) {
			return { success: false, message: "Scope is required" };
		}

		if (!data.projectId) {
			return { success: false, message: "Project ID is required" };
		}

		// Check if project exists
		const project = await prisma.project.findUnique({
			where: { id: data.projectId },
		});
		if (!project) {
			return { success: false, message: "Project not found" };
		}

		// Validate expire date
		if (data.expireAt && data.expireAt <= new Date()) {
			return { success: false, message: "Expiration date must be in the future" };
		}

		const token = await prisma.token.create({
			data: {
				scope: data.scope,
				expireAt: data.expireAt || new Date(Date.now() + DEFAULT_EXPIRE_TIME),
				projectId: data.projectId,
			},
		});

		console.log(`✅ Successfully created token with scope: ${data.scope}`);

		return {
			success: true,
			token,
			message: `Token created successfully!`,
		};
	} catch (error: any) {
		// Handle database errors
		if (error.code === "P2002") {
			// Prisma unique constraint violation
			return {
				success: false,
				message: "A token with this ID already exists",
			};
		}

		if (error.code === "P2003") {
			// Foreign key constraint violation
			return {
				success: false,
				message: "Invalid project ID provided",
			};
		}

		// Log unexpected errors
		console.error("❌ Unexpected error in addToken:", {
			error,
			data,
			timestamp: new Date().toISOString(),
		});

		return {
			success: false,
			message: "An unexpected error occurred. Please try again.",
		};
	}
}

export async function updateToken(
	id: string,
	data: Partial<{
		projectId: string;
		scope: RepoScope;
		expireAt: Date | null;
	}>,
): Promise<{ success: boolean; token?: Token; message?: string }> {
	await requireAdmin();

	try {
		// Input validation
		if (!id) {
			return { success: false, message: "Token ID is required" };
		}

		if (!data || Object.keys(data).length === 0) {
			return { success: false, message: "No data provided for update" };
		}

		// Check if token exists
		const existingToken = await prisma.token.findUnique({ where: { id } });
		if (!existingToken) {
			return { success: false, message: "Token not found" };
		}

		// Validate expire date if provided
		if (data.expireAt && data.expireAt <= new Date()) {
			return { success: false, message: "Expiration date must be in the future" };
		}

		// Filter out undefined values and fields that shouldn't be updated
		const filteredData = Object.fromEntries(
			Object.entries(data).filter(
				([key, value]) =>
					value !== undefined &&
					!["id", "createdAt", "isRevoked", "isUsed", "usedAt", "usedBy"].includes(key),
			),
		);

		// Update token
		const updatedToken = await prisma.token.update({
			where: { id },
			data: filteredData,
		});

		console.log(`✅ Successfully updated token: ${id}`);

		return {
			success: true,
			token: updatedToken,
			message: `Token updated successfully!`,
		};
	} catch (error: any) {
		// Handle database errors
		if (error.code === "P2025") {
			// Prisma record not found
			return {
				success: false,
				message: "Token not found",
			};
		}

		// Log unexpected errors
		console.error("❌ Unexpected error in updateToken:", {
			error,
			tokenId: id,
			updateData: data,
			timestamp: new Date().toISOString(),
		});

		return {
			success: false,
			message: "An unexpected error occurred. Please try again.",
		};
	}
}

export async function deleteToken(id: string): Promise<{ success: boolean; message?: string }> {
	await requireAdmin();

	try {
		// Check if token exists
		const token = await prisma.token.findUnique({ where: { id } });
		if (!token) {
			return { success: false, message: "Token not found" };
		}

		// Delete token
		await prisma.token.delete({ where: { id } });

		console.log(`✅ Successfully deleted token: ${id}`);

		return {
			success: true,
			message: "Token deleted successfully",
		};
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma record not found
			return {
				success: false,
				message: "Token not found",
			};
		}

		// Log unexpected errors
		console.error("❌ Unexpected error in deleteToken:", {
			error,
			tokenId: id,
			timestamp: new Date().toISOString(),
		});

		return {
			success: false,
			message: "An unexpected error occurred while deleting the token. Please try again.",
		};
	}
}

export async function getCMSStats(): Promise<{ success: boolean; stats?: CMSStats; message?: string }> {
	await requireAdmin();

	try {
		const [totalRepositories, activeTokens] = await Promise.all([
			prisma.project.count(),
			prisma.token.count({ where: { isRevoked: false } }),
		]);

		const stats: CMSStats = {
			totalRepositories,
			activeTokens,
			pendingRequests: 0,
			requestsThisMonth: 0,
		};

		return { success: true, stats };
	} catch (error) {
		console.error("❌ Error fetching CMS stats:", error);
		return {
			success: false,
			message: "Failed to load CMS statistics. Please try again.",
		};
	}
}
