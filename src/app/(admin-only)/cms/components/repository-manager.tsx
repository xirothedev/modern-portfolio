import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { getProjects } from "../actions";
import { columns } from "./repository-manager-column";
import { RepositoryManagerTable } from "./repository-manager-table";

export async function RepositoryManager() {
	const results = await getProjects();

	if (!results.success) {
		return (
			<div className="space-y-4">
				<Alert className="border-red-700 bg-red-900/80">
					<AlertCircle className="h-4 w-4 text-white" />
					<AlertDescription className="text-white">
						<strong>Error:</strong> {results.message || "Failed to load projects"}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const data = results.data?.map(({ project }) => project) ?? [];

	return (
		<div className="space-y-4">
			{results.message && (
				<Alert className="border-yellow-700 bg-yellow-900/80">
					<AlertCircle className="h-4 w-4 text-white" />
					<AlertDescription className="text-white">{results.message}</AlertDescription>
				</Alert>
			)}
			<div className="relative rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
				<RepositoryManagerTable columns={columns} data={data} />
			</div>
		</div>
	);
}
