import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
	return (
		<SignIn
			appearance={{
				elements: {
					rootBox: "w-full",
					card: "bg-transparent shadow-none",
					headerTitle: "text-2xl font-bold text-white",
					headerSubtitle: "text-zinc-400",
					socialButtonsBlockButton: "border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50",
					formButtonPrimary: "bg-purple-500 hover:bg-purple-600",
					footer: "text-zinc-400",
					footerActionLink: "text-purple-400 hover:text-purple-300",
				},
			}}
		/>
	);
}
