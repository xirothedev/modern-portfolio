import { getTokens } from "../actions";
import { columns } from "./token-manager-column";
import { TokenManagerTable } from "./token-manager-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export async function TokenManager() {
	const results = await getTokens();

	const data =
		results.success && results.tokens
			? results.tokens.map((token) => ({
					id: token.id,
					scope: token.scope,
					createdAt: token.createdAt,
					expireAt: token.expireAt,
					isRevoked: token.isRevoked,
					isUsed: token.isUsed,
					usedAt: token.usedAt,
					usedBy: token.usedBy,
					projectId: token.projectId,
				}))
			: [];

	return (
		<div className="space-y-4">
			{/* Security Notice */}
			<Alert className="border-red-700 bg-red-900/80">
				<AlertCircle className="h-4 w-4 text-white" />
				<AlertDescription className="text-white">
					<strong>Security Notice:</strong> Tokens are encrypted and stored securely
				</AlertDescription>
			</Alert>

			{/* Token Table */}
			<div className="relative rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
				<TokenManagerTable columns={columns} data={data} />
			</div>
		</div>
	);
}
