import { getProjects } from "../actions";
import { columns } from "./repository-manager-column";
import { RepositoryManagerTable } from "./repository-manager-table";

export async function RepositoryManager() {
	const results = await getProjects();

	const data =
		results.data?.map(({ project }) => ({
			id: project.id,
			name: project.repoName,
			slug: project.slug,
			createdAt: project.createdAt,
			updateAt: project.updateAt,
		})) ?? [];

	return (
		<div className="space-y-4">
			<div className="relative rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
				<RepositoryManagerTable columns={columns} data={data} />
			</div>
		</div>
	);
}
