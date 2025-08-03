"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { completeOnboarding } from "./actions";

const SOCIAL_PLATFORMS = [
	{ id: "facebook", name: "Facebook" },
	{ id: "twitter", name: "Twitter/X" },
	{ id: "linkedin", name: "LinkedIn" },
	{ id: "instagram", name: "Instagram" },
	{ id: "youtube", name: "YouTube" },
	{ id: "other", name: "Other" },
] as const;

type Platforms = (typeof SOCIAL_PLATFORMS)[number]["id"] | string;

export default function OnboardingComponent() {
	const [error, setError] = useState<string>("");
	const [selectedPlatform, setSelectedPlatform] = useState<Platforms>("");
	const [otherPlatform, setOtherPlatform] = useState<string>("");
	const { user } = useUser();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const platform = selectedPlatform === "other" ? otherPlatform : selectedPlatform;

		if (!platform) {
			setError("Please select or specify a platform");
			return;
		}

		const formData = new FormData();
		formData.append("platform", platform);

		const res = await completeOnboarding(formData);
		if (res?.message) {
			await user?.reload();
			router.push("/");
		}
		if (res?.error) {
			setError(res.error);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="mx-auto max-w-md rounded-lg bg-zinc-900 p-6 shadow-xl"
		>
			<motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} className="mb-6 text-2xl font-bold text-zinc-100">
				Welcome! How did you find us?
			</motion.h1>

			<motion.form initial={{ y: 20 }} animate={{ y: 0 }} onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="platform">Select Platform</Label>
					<Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
						<SelectTrigger id="platform" className="w-full border-zinc-700 bg-zinc-800 text-zinc-100">
							<SelectValue placeholder="Choose a platform" />
						</SelectTrigger>
						<SelectContent className="border-zinc-700 bg-zinc-800">
							{SOCIAL_PLATFORMS.map((platform) => (
								<SelectItem
									key={platform.id}
									value={platform.id}
									className="cursor-pointer text-zinc-100 hover:bg-zinc-700/30 hover:text-zinc-100"
								>
									{platform.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{selectedPlatform === "other" && (
					<div className="space-y-2">
						<Label htmlFor="other-platform">Specify Platform</Label>
						<input
							id="other-platform"
							type="text"
							value={otherPlatform}
							onChange={(e) => setOtherPlatform(e.target.value)}
							className="w-full rounded border border-zinc-700 bg-zinc-800 p-2 text-zinc-100 focus:border-transparent focus:ring-2 focus:ring-blue-500"
							placeholder="Enter platform name"
							required
						/>
					</div>
				)}

				{error && <p className="text-red-400">Error: {error}</p>}

				<Button
					type="submit"
					className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
				>
					Continue
				</Button>
			</motion.form>
		</motion.div>
	);
}
