import { Database, Key, TrendingUp, Users } from "lucide-react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { getCMSStats } from "../actions";
import { cn } from "@/lib/utils";

export async function CMSStatsComponent() {
	const results = await getCMSStats();

	if (!results.success) {
		return (
			<div className="mb-8">
				<Alert className="border-red-700 bg-red-900/80">
					<AlertCircle className="h-4 w-4 text-white" />
					<AlertDescription className="text-white">
						<strong>Error:</strong> {results.message || "Failed to load statistics"}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const { stats } = results;

	const statCards = [
		{
			title: "Total Repositories",
			value: stats?.totalRepositories,
			icon: Database,
			color: "text-purple-400",
			bgColor: "bg-purple-500/20",
		},
		{
			title: "Active Tokens",
			value: stats?.activeTokens,
			icon: Key,
			color: "text-pink-400",
			bgColor: "bg-pink-500/20",
		},
		{
			title: "Pending Requests",
			value: stats?.pendingRequests,
			icon: Users,
			color: "text-blue-400",
			bgColor: "bg-blue-500/20",
		},
		{
			title: "This Month",
			value: stats?.requestsThisMonth,
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
						<div className={cn("rounded-lg border border-white/10 p-2", stat.bgColor)}>
							<stat.icon className={cn("h-6 w-6", stat.color)} />
						</div>
					</div>
					{/* Subtle gradient overlay */}
					<div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-black/5"></div>
				</div>
			))}
		</div>
	);
}
