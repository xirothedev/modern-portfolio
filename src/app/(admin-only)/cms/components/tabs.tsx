import { BarChart3, Database, Key } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import ClientTabs from "./client-tabs";
import { RepositoryManager } from "./repository-manager";
import { TokenManager } from "./token-manager";

export default function CMSTabs() {
	return (
		<Tabs defaultValue="repositories" className="space-y-6">
			<ClientTabs />

			<TabsContent value="repositories" className="space-y-6">
				<Card className="border border-zinc-700/50 bg-zinc-800/50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-white">
							<Database className="h-5 w-5" />
							Repository Management
						</CardTitle>
						<CardDescription className="text-gray-400">
							Add, edit, or remove GitHub repositories available for access requests. Configure repository
							settings and permissions.
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
							Manage GitHub personal access tokens for API authentication. Ensure secure storage and
							proper permissions.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<TokenManager />
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="analytics" className="space-y-6">
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
						<div className="py-12 text-center text-gray-500">
							<BarChart3 className="mx-auto mb-4 h-12 w-12 opacity-50" />
							<p>Analytics dashboard coming soon...</p>
							<p className="mt-2 text-sm">
								Track request patterns, popular repositories, and user activity.
							</p>
						</div>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
