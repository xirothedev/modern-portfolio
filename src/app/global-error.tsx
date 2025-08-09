"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const router = useRouter();

	return (
		<html>
			<body>
				<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-zinc-900 via-zinc-900 to-black p-4">
					{/* Animated blob elements to match homepage */}
					<div className="pointer-events-none absolute inset-0 z-0">
						<div className="animate-blob absolute top-20 left-10 h-72 w-72 rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
						<div className="animate-blob animation-delay-2000 absolute top-40 right-10 h-72 w-72 rounded-full bg-yellow-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
						<div className="animate-blob animation-delay-4000 absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-pink-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
					</div>
					<Card className="relative z-10 mx-auto w-full max-w-md border-0 bg-zinc-900/50 shadow-2xl backdrop-blur-sm">
						<CardContent className="space-y-6 p-8 text-center">
							{/* Error Icon */}
							<div className="flex justify-center">
								<div className="relative">
									<div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
										<AlertTriangle className="h-10 w-10 text-red-600" />
									</div>
									<div className="absolute -top-1 -right-1 h-6 w-6 animate-pulse rounded-full bg-red-500"></div>
								</div>
							</div>

							{/* Error Message */}
							<div className="space-y-2">
								<h1 className="text-2xl font-bold text-white">Oops! Something went wrong</h1>
								<p className="text-sm leading-relaxed text-slate-400">
									We encountered an unexpected error. Don&apos;t worry, our team has been notified and
									we&apos;re working to fix it.
								</p>
							</div>

							{/* Error Details (Development) */}
							{process.env.NODE_ENV === "development" && (
								<div className="rounded-lg bg-slate-100 p-4 text-left">
									<p className="font-mono text-xs break-all text-slate-700">{error.message}</p>
									{error.digest && (
										<p className="mt-2 text-xs text-slate-500">Error ID: {error.digest}</p>
									)}
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex flex-col gap-3 pt-4 sm:flex-row">
								<Button
									onClick={reset}
									className="group flex-1 bg-blue-600 text-white hover:bg-blue-700"
								>
									<RefreshCw className="mr-2 h-4 w-4 group-hover:animate-spin" />
									Try Again
								</Button>
								<Button
									variant="outline"
									onClick={() => (window.location.href = "/")}
									className="flex-1"
								>
									<Home className="mr-2 h-4 w-4" />
									Go Home
								</Button>
							</div>

							{/* Support Link */}
							<div className="border-t border-slate-200 pt-4">
								<p className="text-xs text-slate-500">
									Need help?{" "}
									<a href="mailto:support@example.com" className="text-blue-600 hover:underline">
										Contact Support
									</a>
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</body>
		</html>
	);
}
