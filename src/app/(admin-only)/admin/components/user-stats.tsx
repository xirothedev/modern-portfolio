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

	return (
		<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
			<div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 shadow-lg backdrop-blur-sm">
				<div className="text-sm font-medium text-zinc-400">Total Users</div>
				<div className="text-2xl font-bold text-white">{data?.total}</div>
			</div>

			<div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 shadow-lg backdrop-blur-sm">
				<div className="text-sm font-medium text-zinc-400">Admins</div>
				<div className="text-2xl font-bold text-pink-400">{data?.admins}</div>
			</div>

			<div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 shadow-lg backdrop-blur-sm">
				<div className="text-sm font-medium text-zinc-400">Moderators</div>
				<div className="text-2xl font-bold text-purple-400">{data?.moderators}</div>
			</div>

			<div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 shadow-lg backdrop-blur-sm">
				<div className="text-sm font-medium text-zinc-400">No Role</div>
				<div className="text-2xl font-bold text-zinc-300">{data?.noRole}</div>
			</div>
		</div>
	);
}
