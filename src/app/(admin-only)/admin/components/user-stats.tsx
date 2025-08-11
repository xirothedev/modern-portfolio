import { Shield, ShieldCheck, ShieldX, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { userStats } from "../actions";

interface UserStats {
	total: number;
	admins: number;
	moderators: number;
	noRole: number;
}

export async function UserStats() {
	const { data, success, message } = await userStats();

	if (!success) {
		throw new Error(message);
	}

	const statCards = [
		{
			title: "Total Users",
			value: data?.total,
			icon: Users,
			color: "text-white",
			bgColor: "bg-white/20",
		},
		{
			title: "Administrators",
			value: data?.admins,
			icon: ShieldCheck,
			color: "text-pink-400",
			bgColor: "bg-pink-400/20",
		},
		{
			title: "Moderators",
			value: data?.moderators,
			icon: Shield,
			color: "text-purple-400",
			bgColor: "bg-purple-400/20",
		},
		{
			title: "Users",
			value: data?.noRole,
			icon: ShieldX,
			color: "text-zinc-300",
			bgColor: "bg-zinc-300/20",
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
