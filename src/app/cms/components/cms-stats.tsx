"use client";

import { Database, Key, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getCMSStats, type CMSStats } from "../actions";

export function CMSStatsComponent() {
	const [stats, setStats] = useState<CMSStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadStats();
	}, []);

	async function loadStats() {
		try {
			setLoading(true);
			const result = await getCMSStats();
			if (result.success && result.stats) {
				setStats(result.stats);
			}
		} catch (error) {
			console.error("Failed to load stats:", error);
		} finally {
			setLoading(false);
		}
	}

	if (loading || !stats) {
		return null;
	}

	const statCards = [
		{
			title: "Total Repositories",
			value: stats.totalRepositories,
			icon: Database,
			color: "text-purple-400",
			bgColor: "bg-purple-500/20",
		},
		{
			title: "Active Tokens",
			value: stats.activeTokens,
			icon: Key,
			color: "text-pink-400",
			bgColor: "bg-pink-500/20",
		},
		{
			title: "Pending Requests",
			value: stats.pendingRequests,
			icon: Users,
			color: "text-blue-400",
			bgColor: "bg-blue-500/20",
		},
		{
			title: "This Month",
			value: stats.requestsThisMonth,
			icon: TrendingUp,
			color: "text-green-400",
			bgColor: "bg-green-500/20",
		},
	];

	return (
		<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{statCards.map((stat) => (
				<div
					key={stat.title}
					className="relative rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:border-zinc-600/50 hover:bg-zinc-800/70"
				>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-zinc-400">{stat.title}</p>
							<p className="text-2xl font-bold text-white">{stat.value}</p>
						</div>
						<div className={`rounded-lg p-2 ${stat.bgColor} border border-white/10`}>
							<stat.icon className={`h-6 w-6 ${stat.color}`} />
						</div>
					</div>
					{/* Subtle gradient overlay */}
					<div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-black/5"></div>
				</div>
			))}
		</div>
	);
}
