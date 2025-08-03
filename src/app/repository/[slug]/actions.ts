"use server";

import { prisma } from "@/lib/db";
import { createGitHubAPI } from "@/lib/github-api";

interface GrantAccessProps {
	username: string;
	token: string;
	slug: string;
}

export async function checkToken(token: string, slug: string) {
	if (!token || !slug) {
		return { valid: false, message: "Missing parameters" };
	}

	const project = await prisma.project.findUnique({
		where: { slug },
		include: { allowTokens: true },
	});
	if (!project) return { valid: false, message: "Project not found" };

	const now = new Date();
	const validToken = project.allowTokens.find((t) => t.id === token && t.expireAt > now && !t.isUsed);

	if (!validToken) {
		return { valid: false, message: "Invalid or expired token" };
	}

	return { valid: true, project };
}

export async function grantAccess({ username, token, slug }: GrantAccessProps) {
	if (!username || !token || !slug) {
		return { success: false, message: "Missing parameters" };
	}
	const project = await prisma.project.findUnique({
		where: { slug },
		include: { allowTokens: true },
	});
	if (!project) return { success: false, message: "Project not found" };

	const now = new Date();
	const validToken = project.allowTokens.find((t) => t.id === token && t.expireAt > now);
	if (!validToken) return { success: false, message: "Invalid credentials" };

	try {
		const githubAPI = createGitHubAPI();
		await githubAPI.getReadonlyRepository(project.repoName, username);
		await prisma.token.update({
			where: { id: token },
			data: { isUsed: true, usedAt: new Date(), usedBy: username },
		});
		return { success: true, message: "Granted repo access for 3 days!" };
	} catch {
		return { success: false, message: "Error granting GitHub permissions" };
	}
}
