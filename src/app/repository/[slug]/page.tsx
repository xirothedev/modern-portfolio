import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import RepositoryAccessPortal from "./form";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	const project = await prisma.project.findUnique({
		where: { slug },
		include: { allowTokens: true },
	});

	if (!project) return notFound();

	return (
		<div className="flex min-h-screen flex-col">
			<RepositoryAccessPortal slug={slug} repoName={project.repoName} />
		</div>
	);
}
