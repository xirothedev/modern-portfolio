import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
	try {
		const { slug } = await params;

		const project = await prisma.project.findUnique({
			where: { slug },
			include: { allowTokens: true },
		});

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		return NextResponse.json(project);
	} catch (error) {
		console.error("Error fetching project:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
