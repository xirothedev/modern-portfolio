"use server";
import { prisma } from "@/lib/db";
import { createGitHubAPI } from "@/lib/github-api";
import { Project, Token } from "generated/prisma";

export interface CMSStats {
	totalRepositories: number;
	activeTokens: number;
	pendingRequests: number;
	requestsThisMonth: number;
}

export async function getProjects() {
	const projects = await prisma.project.findMany();
	const githubAPI = createGitHubAPI();

	const PROJECTS = await githubAPI.getMultipleRepositories(projects.map((project) => project.repoName));

	const data = projects.map((project) => {
		const repository = PROJECTS.get(project.repoName) ?? null;

		return {
			project,
			repository,
		};
	});

	return {
		success: true,
		data, // [{ project, repository }]
	};
}

export async function addProject(
	data: Omit<Project, "id" | "createdAt">,
): Promise<{ success: boolean; project?: Project; message?: string }> {
	if (!data.repoName || !data.slug) {
		return { success: false, message: "repoName and slug are required" };
	}
	const exists = await prisma.project.findUnique({ where: { repoName: data.repoName } });
	if (exists) {
		return { success: false, message: "Project with this repoName already exists" };
	}
	const project = await prisma.project.create({
		data: {
			...data,
			createdAt: new Date(),
		},
	});
	return { success: true, project };
}

export async function updateProject(
	id: string,
	data: Partial<Project>,
): Promise<{ success: boolean; project?: Project; message?: string }> {
	const project = await prisma.project.findUnique({ where: { id } });
	if (!project) {
		return { success: false, message: "Project not found" };
	}
	const updated = await prisma.project.update({
		where: { id },
		data,
	});
	return { success: true, project: updated };
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
