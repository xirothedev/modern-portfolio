"use server";
import { prisma } from "@/lib/db";
import { createGitHubAPI } from "@/lib/github-api";

interface GrantAccessProps {
	username: string;
	token: string;
	slug: string;
}

export async function grantAccess({ username, token, slug }: GrantAccessProps) {
	if (!username || !token || !slug) {
		return { success: false, message: "Thiếu thông tin" };
	}
	const project = await prisma.project.findUnique({
		where: { slug },
		include: { allowTokens: true },
	});
	if (!project) return { success: false, message: "Project không tồn tại" };

	const now = new Date();
	const validToken = project.allowTokens.find((t) => t.id === token && t.expireAt > now);
	if (!validToken) return { success: false, message: "Token không hợp lệ hoặc đã hết hạn" };

	try {
		const githubAPI = createGitHubAPI();
		await githubAPI.addCollaborator(project.repoName, username, "pull");
		return { success: true, message: "Granted repo access for 3 days!" };
	} catch {
		return { success: false, message: "Error granting GitHub permissions" };
	}
}
