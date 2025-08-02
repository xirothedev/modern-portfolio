"use server";
import { prisma } from "@/lib/db";
import { createGitHubAPI, GitHubRepositoryError } from "@/lib/github-api";
import { Project, Token } from "generated/prisma";

export interface CMSStats {
	totalRepositories: number;
	activeTokens: number;
	pendingRequests: number;
	requestsThisMonth: number;
}

export async function getProjects() {
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
	} catch {
		return {
			success: false,
			message: "Repositories not found",
		};
	}
}

export async function addProject(
	data: Omit<Project, "id" | "createdAt" | "updateAt">,
): Promise<{ success: boolean; project?: Project; message?: string }> {
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

		// Verify repository exists on GitHub if repoName is being updated
		if (data.repoName && data.repoName !== existingProject.repoName) {
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
	const project = await prisma.project.findUnique({ where: { id } });
	if (!project) {
		return { success: false, message: "Project not found" };
	}
	await prisma.project.delete({ where: { id } });
	return { success: true };
}

export async function getTokens(): Promise<{ success: boolean; tokens?: Token[] }> {
	const tokens = await prisma.token.findMany();
	return { success: true, tokens };
}

export async function addToken(
	data: Omit<Token, "id" | "createdAt">,
): Promise<{ success: boolean; token?: Token; message?: string }> {
	if (!data.projectId || !data.expireAt) {
		return { success: false, message: "projectId and expireAt are required" };
	}
	const token = await prisma.token.create({
		data: {
			...data,
			createdAt: new Date(),
		},
	});
	return { success: true, token };
}

export async function updateToken(
	id: string,
	data: Partial<Token>,
): Promise<{ success: boolean; token?: Token; message?: string }> {
	const token = await prisma.token.findUnique({ where: { id } });
	if (!token) {
		return { success: false, message: "Token not found" };
	}
	const updated = await prisma.token.update({
		where: { id },
		data,
	});
	return { success: true, token: updated };
}

export async function deleteToken(id: string): Promise<{ success: boolean; message?: string }> {
	const token = await prisma.token.findUnique({ where: { id } });
	if (!token) {
		return { success: false, message: "Token not found" };
	}
	await prisma.token.delete({ where: { id } });
	return { success: true };
}

export async function getCMSStats(): Promise<{ success: boolean; stats?: CMSStats }> {
	const totalRepositories = await prisma.project.count();
	const activeTokens = await prisma.token.count({ where: { isRevoked: false } });
	const stats: CMSStats = {
		totalRepositories,
		activeTokens,
		pendingRequests: 0,
		requestsThisMonth: 0,
	};
	return { success: true, stats };
}
