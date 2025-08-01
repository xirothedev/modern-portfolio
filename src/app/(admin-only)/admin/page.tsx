import { clerkClient } from "@clerk/nextjs/server";
import { columns } from "./components/columns";
import { UserDataTable } from "./components/user-table";
import { UserStats } from "./components/user-stats";

export default async function AdminDashboard() {
	const client = await clerkClient();
	const rawUsers = await client.users.getUserList();
	console.log(rawUsers.data[0].imageUrl);
	const users = rawUsers.data.map((user) => ({
		id: user.id,
		publicMetadata: user.publicMetadata,
		avatar: user.imageUrl,
		emailAddress: user.primaryEmailAddress?.emailAddress ?? "No email provided",
		username: user.username ?? "-",
		createAt: user.createdAt,
		raw: user.raw,
	}));

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="mb-2 text-3xl font-bold text-white">Admin Dashboard</h1>
				<p className="text-zinc-400">Manage users</p>
			</div>

			<UserStats />
			<UserDataTable columns={columns} data={users} />
		</div>
	);
}
