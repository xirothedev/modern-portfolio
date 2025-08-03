import { unstable_ViewTransition as ViewTransition } from "react";

import { AnimatedName } from "@/components/animated-name";

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
	return (
		<div className="flex gap-4">
			<div className="text-2xl">{icon}</div>
			<div>
				<h3 className="mb-1 font-semibold">{title}</h3>
				<p className="text-sm text-zinc-400">{description}</p>
			</div>
		</div>
	);
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
			<div className="grid w-full max-w-[1000px] gap-8 md:grid-cols-2">
				{/* Left side - Feature list */}
				<div className="hidden flex-col justify-center space-y-8 p-8 text-white md:flex">
					<div className="mb-8 text-5xl font-bold tracking-tight lg:text-6xl">
						<AnimatedName />
					</div>

					<div className="space-y-6">
						<Feature
							icon="🔐"
							title="Private project access"
							description="Protect your confidential or under-development projects with authentication layers."
						/>
						<Feature
							icon="🧑‍💼"
							title="Role-based permissions"
							description="Grant different access levels for admins, collaborators, or clients as needed."
						/>
						<Feature
							icon="⚡"
							title="Instant secure login"
							description="Use token-based or OAuth login methods for quick, secure, and seamless access."
						/>
					</div>
				</div>

				{/* Right side - Auth form */}
				<ViewTransition name="auth-form">
					<div className="col-span-2 mx-auto w-full max-w-md rounded-2xl bg-zinc-900/50 p-4 backdrop-blur-lg md:col-span-1 md:p-4">
						{children}
					</div>
				</ViewTransition>
			</div>
		</div>
	);
}
