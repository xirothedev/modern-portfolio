import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
	const { userId, sessionClaims } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	if (sessionClaims?.metadata?.role !== "admin") {
		redirect("/");
	}

	return { userId, sessionClaims };
}

export async function checkAdmin(): Promise<boolean> {
	try {
		const { sessionClaims } = await auth();
		return sessionClaims?.metadata?.role === "admin";
	} catch {
		return false;
	}
}
