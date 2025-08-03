import { NextRequest } from "next/server";

import { prisma } from "@/lib/db";
import { createGitHubAPI } from "@/lib/github-api";

const githubApi = createGitHubAPI();

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response("Unauthorized", { status: 401 });
	}

	const expiredTokens = await prisma.token.findMany({
		where: {
			isUsed: true,
			expireAt: { lt: new Date() },
		},
		include: { project: true },
	});

	let removed = 0;
	for (const token of expiredTokens) {
		const repoName = token.project.repoName;
		const username = token.usedBy;
		if (!username) continue;
		try {
			await githubApi.removeCollaborator(repoName, username);
			removed++;
		} catch (err) {
			console.error(`Failed to remove ${username} from ${repoName}:`, err);
		}
	}

	return Response.json({ success: true, removed });
}
