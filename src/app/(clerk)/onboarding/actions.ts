"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (formData: FormData) => {
	const { userId } = await auth();

	if (!userId) {
		return { error: "No logged in user found" };
	}

	const platform = formData.get("platform");

	if (!platform) {
		return { error: "Platform selection is required" };
	}

	const client = await clerkClient();

	try {
		const res = await client.users.updateUser(userId, {
			publicMetadata: {
				onboardingComplete: true,
				referralPlatform: platform,
				onboardingCompletedAt: new Date().toISOString(),
			},
		});
		return { message: res.publicMetadata };
	} catch (err) {
		console.error("Onboarding error:", err);
		return { error: "There was an error completing the onboarding process." };
	}
};
