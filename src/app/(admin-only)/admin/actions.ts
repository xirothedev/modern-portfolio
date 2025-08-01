"use server";

import { Roles } from "@/types/globals";
import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setRole(data: { userId: string; role: Roles }) {
	const client = await clerkClient();

	// Check that the user trying to set the role is an admin
	const isAdmin = await checkRole("admin");
	if (!isAdmin) {
		return { success: false, message: "Not Authorized" };
	}

	try {
		const res = await client.users.updateUserMetadata(data.userId, {
			publicMetadata: { role: data.role },
		});

		revalidatePath("/admin");
		return { success: true, message: `Role updated to ${data.userId}`, data: res.publicMetadata };
	} catch (err) {
		console.error("Error setting role:", err);
		return { success: false, message: "Failed to update role" };
	}
}

export async function removeRole(data: { userId: string }) {
	const client = await clerkClient();

	// Check that the user trying to remove the role is an admin
	const isAdmin = await checkRole("admin");
	if (!isAdmin) {
		return { success: false, message: "Not Authorized" };
	}

	try {
		const res = await client.users.updateUserMetadata(data.userId, {
			publicMetadata: { role: null },
		});

		revalidatePath("/admin");
		return { success: true, message: "Role removed", data: res.publicMetadata };
	} catch (err) {
		console.error("Error removing role:", err);
		return { success: false, message: "Failed to remove role" };
	}
}

export async function deleteUser(formData: FormData) {
	const client = await clerkClient();

	// Check that the user trying to delete is an admin
	const isAdmin = await checkRole("admin");
	if (!isAdmin) {
		return { success: false, message: "Not Authorized" };
	}

	try {
		const userId = formData.get("id") as string;

		if (!userId) {
			return { success: false, message: "Missing user ID" };
		}

		await client.users.deleteUser(userId);

		revalidatePath("/admin");
		return { success: true, message: "User deleted successfully" };
	} catch (err) {
		console.error("Error deleting user:", err);
		return { success: false, message: "Failed to delete user" };
	}
}

export async function userStats() {
	const client = await clerkClient();

	// Check that the user trying to delete is an admin
	const isAdmin = await checkRole("admin");
	if (!isAdmin) {
		return { success: false, message: "Not Authorized" };
	}

	try {
		const users = await client.users.getUserList();

		const stats = {
			total: users.data.length,
			admins: users.data.filter((user) => user.publicMetadata.role === "admin").length,
			moderators: users.data.filter((user) => user.publicMetadata.role === "moderator").length,
			noRole: users.data.filter((user) => !user.publicMetadata.role).length,
		};

		return {
			success: true,
			data: stats,
		};
	} catch (err) {
		console.error("Error get user stats:", err);
		return { success: false, message: "Failed to get user stats" };
	}
}
