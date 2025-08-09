"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, MapPin, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-zinc-900 via-zinc-900 to-black p-4">
			{/* Animated blob elements to match homepage */}
			<div className="pointer-events-none absolute inset-0 z-0">
				<div className="animate-blob absolute top-20 left-10 h-72 w-72 rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
				<div className="animate-blob animation-delay-2000 absolute top-40 right-10 h-72 w-72 rounded-full bg-yellow-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
				<div className="animate-blob animation-delay-4000 absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-pink-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
			</div>
			<Card className="relative z-10 mx-auto w-full max-w-lg border-0 bg-zinc-900/50 shadow-2xl backdrop-blur-sm">
				<CardContent className="space-y-6 p-8 text-center">
					{/* 404 Animation */}
					<div className="relative">
						<div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-8xl font-bold text-transparent">
							404
						</div>
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
							<div className="flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-purple-100">
								<MapPin className="h-8 w-8 text-purple-600" />
							</div>
						</div>
					</div>

					{/* Error Message */}
					<div className="space-y-3">
						<h1 className="text-3xl font-bold text-white">Page Not Found</h1>
						<p className="leading-relaxed text-slate-400">
							The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you
							back on track!
						</p>
					</div>

					{/* Suggestions */}
					<div className="space-y-2 rounded-lg bg-slate-50 p-4">
						<h3 className="text-sm font-semibold text-slate-900">Here&apos;s what you can do:</h3>
						<ul className="space-y-1 text-left text-sm text-slate-600">
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
								Check the URL for typos
							</li>
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
								Go back to the previous page
							</li>
							<li className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
								Visit our homepage
							</li>
						</ul>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col gap-3 pt-4 sm:flex-row">
						<Button onClick={() => window.history.back()} variant="outline" className="flex-1">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Go Back
						</Button>
						<Link href="/" className="flex-1">
							<Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
								<Home className="mr-2 h-4 w-4" />
								Home
							</Button>
						</Link>
					</div>

					{/* Popular Links */}
					<div className="border-t border-slate-200 pt-6">
						<h3 className="mb-3 text-sm font-semibold text-white">Popular Pages</h3>
						<div className="flex flex-wrap justify-center gap-2">
							{[
								{ href: "/#about", label: "About" },
								{ href: "/#projects", label: "Projects" },
								{ href: "/#contact", label: "Contact" },
								{ href: "/cms", label: "CMS" },
							].map((link) => (
								<Link href={link.href} key={link.href}>
									<Button variant="ghost" size="sm" className="text-xs text-white">
										{link.label}
									</Button>
								</Link>
							))}
						</div>
					</div>

					{/* Search Suggestion */}
					<div className="text-xs text-slate-400">
						<Search className="mr-1 inline h-3 w-3" />
						Try searching for what you need
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
