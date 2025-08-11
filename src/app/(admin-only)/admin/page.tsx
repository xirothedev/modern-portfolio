import { clerkClient } from "@clerk/nextjs/server";
import { Settings } from "lucide-react";

import { columns } from "./components/columns";
import { UserStats } from "./components/user-stats";
import { UserDataTable } from "./components/user-table";

export default async function AdminDashboard() {
	const client = await clerkClient();
	const rawUsers = await client.users.getUserList();
	const users = rawUsers.data.map((user) => ({
		id: user.id,
		publicMetadata: user.publicMetadata,
		avatar: user.imageUrl,
		emailAddress: user.primaryEmailAddress?.emailAddress ?? "No email provided",
		username: user.username ?? "-",
		createdAt: user.createdAt,
		referralPlatform: user.publicMetadata.referralPlatform as string,
		raw: user.raw,
	}));

	return (
		<div className="container mx-auto max-w-7xl px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<div className="mb-4 flex items-center gap-3">
					<div className="relative rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 shadow-lg">
						<span className="pointer-events-none absolute inset-0 animate-pulse rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
						<Settings className="relative z-10 h-7 w-7 animate-spin text-purple-300 drop-shadow-lg transition-all" />
					</div>
					<div>
						<h1 className="text-3xl font-bold text-white">Administration Dashboard</h1>
						<p className="mt-1 text-gray-400">Manage users data</p>
					</div>
				</div>
			</div>

			<UserStats />
			<UserDataTable columns={columns} data={users} />
		</div>
	);
}
