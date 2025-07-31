"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RepoScope, Token } from "generated/prisma";
import { Activity, AlertCircle, Calendar, CheckCircle, Edit, Eye, EyeOff, Key, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { deleteToken, getTokens } from "../actions";

type Inputs = {
	id: string;
	expireAt: Date;
	scope: RepoScope;
	projectId: string;
};

export function TokenManager() {
	const [tokens, setTokens] = useState<Token[]>([]);
	const [loading, setLoading] = useState(true);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [editingToken, setEditingToken] = useState<Token | null>(null);
	const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");
	const [showTokenValue, setShowTokenValue] = useState<Record<string, boolean>>({});
	const {
		register,
		handleSubmit,
		reset,
		getFieldState,
		// formState: { errors },
	} = useForm<Inputs>();
	const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

	useEffect(() => {
		loadTokens();
	}, []);

	async function loadTokens() {
		try {
			setLoading(true);
			const result = await getTokens();
			if (result.success && result.tokens) {
				setTokens(result.tokens);
			}
		} catch (error) {
			console.error("Failed to load tokens:", error);
		} finally {
			setLoading(false);
		}
	}

	function resetForm() {
		reset();
		setEditingToken(null);
		setSubmitStatus("idle");
		setErrorMessage("");
	}

	function maskToken(token: string) {
		if (!token) return "";
		const visible = token.slice(-4);
		return `****${visible}`;
	}

	function toggleTokenVisibility(id: string) {
		setShowTokenValue((prev) => ({ ...prev, [id]: !prev[id] }));
	}

	async function handleDelete(id: string) {
		try {
			const result = await deleteToken(id);
			if (result.success) {
				await loadTokens();
			}
		} catch (error) {
			console.error("Failed to delete token:", error);
		}
	}

	if (loading) {
		return <div className="py-8 text-center">Loading tokens...</div>;
	}

	return (
		<div className="space-y-6">
			{/* Header Actions */}
			<div className="flex items-center justify-end">
				<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={resetForm}
							className="flex items-center gap-2 border-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
						>
							<Plus className="h-4 w-4" />
							Add Token
						</Button>
					</DialogTrigger>
					<DialogContent className="bg-zinc-900/80 sm:max-w-[500px]">
						<DialogHeader>
							<DialogTitle>{editingToken ? "Edit Token" : "Add New Token"}</DialogTitle>
							<DialogDescription>
								{editingToken
									? "Update token settings and configuration."
									: "Add a new token for API authentication."}
							</DialogDescription>
						</DialogHeader>

						<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
							{!editingToken && (
								<div className="space-y-2">
									<Label htmlFor="tokenId">Token Value *</Label>
									<Input
										id="tokenId"
										type="password"
										{...register("id", { required: true })}
										className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-400"
									/>
									<p className="text-xs text-gray-500">
										Enter your token value. It will be stored securely.
									</p>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="tokenScope">Scope</Label>
								<Input
									id="tokenScope"
									{...register("scope", { required: true })}
									placeholder="pull, push, admin"
									className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-400"
								/>
								<p className="text-xs text-gray-500">The scope this token has access to</p>
							</div>
						</form>

						{submitStatus === "error" && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{errorMessage}</AlertDescription>
							</Alert>
						)}

						{submitStatus === "success" && (
							<Alert>
								<CheckCircle className="h-4 w-4" />
								<AlertDescription>
									Token {editingToken ? "updated" : "added"} successfully!
								</AlertDescription>
							</Alert>
						)}

						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => {
									setIsAddDialogOpen(false);
									resetForm();
								}}
								disabled={submitStatus === "loading"}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={submitStatus === "loading" || (!editingToken && !getFieldState("id"))}
							>
								{submitStatus === "loading" ? "Saving..." : editingToken ? "Update" : "Add Token"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* Security Notice */}
			<Alert className="border-red-700 bg-red-900/80">
				<AlertCircle className="h-4 w-4 text-white!" />
				<AlertDescription className="text-white">
					<strong>Security Notice:</strong> Tokens are encrypted and stored securely
				</AlertDescription>
			</Alert>

			{/* Token List */}
			<div className="space-y-4">
				{tokens.length === 0 ? (
					<div className="relative rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-12 text-center backdrop-blur-sm">
						<Key className="mx-auto mb-4 h-12 w-12 text-gray-400" />
						<h3 className="mb-2 text-lg font-semibold text-white">No tokens configured</h3>
						<p className="mb-4 text-zinc-400">Add a token to enable API functionality.</p>
						<Button
							onClick={() => setIsAddDialogOpen(true)}
							className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
						>
							<Plus className="mr-2 h-4 w-4" />
							Add Token
						</Button>
						<div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-transparent via-transparent to-black/5"></div>
					</div>
				) : (
					<div className="relative rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="text-white">Token ID</TableHead>
									<TableHead className="text-white">Status</TableHead>
									<TableHead className="text-white">Scope</TableHead>
									<TableHead className="text-white">Created / Used At</TableHead>
									<TableHead className="text-white">Used By</TableHead>
									<TableHead className="text-right text-white">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{tokens.map((token) => (
									<TableRow key={token.id}>
										<TableCell>
											<span className="font-medium text-white">{token.id}</span>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Badge
													variant={!token.isRevoked ? "default" : "secondary"}
													className="bg-zinc-700 text-zinc-100"
												>
													{!token.isRevoked ? "Active" : "Revoked"}
												</Badge>
												{token.isUsed && (
													<Badge variant="outline">
														<Activity className="mr-1 h-3 w-3" />
														Used
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="outline" className="bg-zinc-700 text-xs text-zinc-100">
												{token.scope}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex flex-col gap-1">
												<span className="flex items-center gap-1 text-zinc-400">
													<Calendar className="h-4 w-4" />
													{new Date(token.createdAt).toLocaleDateString()}
												</span>
												{token.isUsed && token.usedAt && (
													<span className="flex items-center gap-1 text-zinc-400">
														<Activity className="h-4 w-4" />
														{new Date(token.usedAt).toLocaleDateString()}
													</span>
												)}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{token.usedBy ? (
													<span className="text-sm text-zinc-400">{token.usedBy}</span>
												) : (
													<span className="text-sm text-zinc-500">-</span>
												)}
											</div>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-zinc-300 hover:text-zinc-100"
												>
													<Edit className="h-4 w-4" />
												</Button>
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-zinc-300 hover:text-red-500"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent className="border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm">
														<AlertDialogHeader>
															<AlertDialogTitle className="text-white">
																Delete Token
															</AlertDialogTitle>
															<AlertDialogDescription className="text-zinc-400">
																Are you sure you want to delete &quot;{token.id}&quot;?
																This action cannot be undone and may break API
																functionality.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel className="border-zinc-600/50 bg-zinc-700/50 text-zinc-300 hover:border-zinc-500/50 hover:bg-zinc-700/70">
																Cancel
															</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => handleDelete(token.id)}
																className="bg-red-600 hover:bg-red-700"
															>
																Delete
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</div>
	);
}
