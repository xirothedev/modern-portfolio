import { Settings } from "lucide-react";

import { CMSStatsComponent } from "./components/cms-stats";
import CMSTabs from "./components/tabs";

export default function CMSPage() {
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
						<h1 className="text-3xl font-bold text-white">Repository Management System</h1>
						<p className="mt-1 text-gray-400">Manage GitHub repositories, tokens, and access settings</p>
					</div>
				</div>
			</div>

			<CMSStatsComponent />
			<CMSTabs />
		</div>
	);
}
