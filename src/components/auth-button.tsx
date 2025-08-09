"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";

export function AuthButton() {
	return (
		<>
			<SignedOut>
				<SignInButton mode="redirect">
					<Button
						variant="outline"
						size="sm"
						className="rounded-full border-zinc-700 bg-transparent text-purple-400 transition-all duration-300 hover:border-purple-500 hover:bg-purple-500/10 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
					>
						<User className="mr-2 h-4 w-4" />
						Sign In
					</Button>
				</SignInButton>
			</SignedOut>
			<SignedIn>
				<UserButton
					appearance={{
						elements: {
							avatarBox: {
								width: "32px",
								height: "32px",
								borderRadius: "9999px",
							},
							userButtonPopoverCard: {
								background: "rgba(39, 39, 42, 0.95)",
								backdropFilter: "blur(10px)",
								border: "1px solid rgba(168, 85, 247, 0.2)",
								borderRadius: "16px",
								boxShadow: "0 4px 20px rgba(168, 85, 247, 0.1)",
							},
							userButtonPopoverActionButton: {
								"&:hover": {
									background: "rgba(168, 85, 247, 0.1)",
									transition: "all 0.2s ease",
								},
							},
						},
					}}
				/>
			</SignedIn>
		</>
	);
}
