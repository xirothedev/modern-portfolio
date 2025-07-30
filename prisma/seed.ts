import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
	const project1 = await prisma.project.upsert({
		where: { slug: "public-project" },
		update: {},
		create: {
			title: "Public Project",
			slug: "public-project",
			content: "This is a public project.",
			isPrivate: false,
		},
	});

	const project2 = await prisma.project.upsert({
		where: { slug: "private-project" },
		update: {},
		create: {
			title: "Private Project",
			slug: "private-project",
			content: "This is a private project.",
			isPrivate: true,
		},
	});

	const token = randomUUID();
	await prisma.accessToken.create({
		data: {
			token,
			projectId: project2.id,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
		},
	});

	console.log("Magic token:", token);
}

main();
