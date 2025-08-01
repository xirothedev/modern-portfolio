"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Database, Key, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CMSStatsComponent } from "./components/cms-stats";
import { RepositoryManager } from "./components/repository-manager";
import { TokenManager } from "./components/token-manager";

const tabs = [
	{ value: "repositories", icon: <Database className="h-4 w-4" />, label: "Repositories" },
	{ value: "tokens", icon: <Key className="h-4 w-4" />, label: "Tokens" },
	{ value: "analytics", icon: <BarChart3 className="h-4 w-4" />, label: "Analytics" },
];

export default function CMSPage() {
	const [hovered, setHovered] = useState<string | null>(null);
	const [active, setActive] = useState("repositories");

	return (
		<div className="min-h-screen bg-linear-to-b from-zinc-900 via-zinc-900 to-black">
			<div className="container mx-auto max-w-7xl px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="mb-4 flex items-center gap-3">
						<div className="relative rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 shadow-lg">
							<span className="pointer-events-none absolute inset-0 animate-pulse rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
							<Settings className="relative z-10 h-7 w-7 animate-spin text-purple-300 drop-shadow-lg transition-all" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-white">Repository Management System</h1>
							<p className="mt-1 text-gray-400">
								Manage GitHub repositories, tokens, and access settings
							</p>
						</div>
					</div>
				</div>

				<CMSStatsComponent />

				{/* Main Content */}
				<Tabs defaultValue={active} className="space-y-6" onValueChange={setActive}>
					<div className="relative">
						<TabsList className="relative grid h-10 w-full grid-cols-3 overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-1 shadow backdrop-blur-sm lg:w-auto lg:grid-cols-3">
							<AnimatePresence>
								{(hovered || active) && (
									<motion.span
										layoutId="tab-highlight"
										className="absolute z-0 h-[30px] w-[calc(1/3*100%-0.65%)] rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
										style={{
											left: `${tabs.findIndex((t) => t.value === (hovered || active)) * 33.3333 + 0.35}%`,
											top: 4,
										}}
										initial={{ opacity: 0.7 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ type: "spring", stiffness: 300, damping: 30 }}
									/>
								)}
							</AnimatePresence>
							{tabs.map((tab) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className={`relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-1 transition-all duration-200 ${active === tab.value ? "bg-transparent! font-bold text-white" : "bg-transparent text-zinc-400"} `}
									onMouseEnter={() => setHovered(tab.value)}
									onMouseLeave={() => setHovered(null)}
								>
									{tab.icon}
									<span className="hidden sm:inline">{tab.label}</span>
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					<TabsContent value="repositories" className="space-y-6">
						<Card className="border border-zinc-700/50 bg-zinc-800/50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-white">
									<Database className="h-5 w-5" />
									Repository Management
								</CardTitle>
								<CardDescription className="text-gray-400">
									Add, edit, or remove GitHub repositories available for access requests. Configure
									repository settings and permissions.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<RepositoryManager />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="tokens" className="space-y-6">
						<Card className="border border-zinc-700/50 bg-zinc-800/50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-white">
									<Key className="h-5 w-5" />
									GitHub Token Management
								</CardTitle>
								<CardDescription className="text-gray-400">
									Manage GitHub personal access tokens for API authentication. Ensure secure storage
									and proper permissions.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<TokenManager />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="analytics" className="space-y-6">
						<div className="grid gap-6">
							<Card className="border border-zinc-700/50 bg-zinc-800/50">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-white">
										<BarChart3 className="h-5 w-5" />
										Access Request Analytics
									</CardTitle>
									<CardDescription className="text-gray-400">
										View statistics and insights about repository access requests.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="py-12 text-center text-gray-500 dark:text-gray-400">
										<BarChart3 className="mx-auto mb-4 h-12 w-12 opacity-50" />
										<p>Analytics dashboard coming soon...</p>
										<p className="mt-2 text-sm">
											Track request patterns, popular repositories, and user activity.
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
