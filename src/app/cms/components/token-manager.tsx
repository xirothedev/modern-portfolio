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
import { Card, CardContent } from "@/components/ui/card";
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
					<strong>Security Notice:</strong> Tokens are encrypted and stored securely. Only the last 4
					characters are visible for identification purposes.
				</AlertDescription>
			</Alert>

			{/* Token List */}
			<div className="space-y-4">
				{tokens.length === 0 ? (
					<Card>
						<CardContent className="py-12 text-center">
							<Key className="mx-auto mb-4 h-12 w-12 text-gray-400" />
							<h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
								No tokens configured
							</h3>
							<p className="mb-4 text-gray-500 dark:text-gray-400">
								Add a token to enable API functionality.
							</p>
							<Button onClick={() => setIsAddDialogOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Add Token
							</Button>
						</CardContent>
					</Card>
				) : (
					tokens.map((token) => (
						<Card
							key={token.id}
							className="border border-zinc-700/70 bg-zinc-800 transition-shadow hover:shadow-md"
						>
							<CardContent className="bg-zinc-800 p-6">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="mb-2 flex items-center gap-3">
											<h3 className="text-lg font-semibold text-white">{token.id}</h3>
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

										<div className="mb-3 space-y-2">
											<div className="flex items-center gap-2">
												<Label className="text-sm font-medium text-zinc-300">Token:</Label>
												<code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
													{showTokenValue[token.id] ? token.id : maskToken(token.id)}
												</code>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => toggleTokenVisibility(token.id)}
												>
													{showTokenValue[token.id] ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</Button>
											</div>

											<Badge
												key={token.scope}
												variant="outline"
												className="bg-zinc-700 text-xs text-zinc-100"
											>
												{token.scope}
											</Badge>
										</div>

										<div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
											<span className="flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												Created {new Date(token.createdAt).toLocaleDateString()}
											</span>
											{token.isUsed && token.usedAt && (
												<span className="flex items-center gap-1">
													<Activity className="h-4 w-4" />
													Used {new Date(token.usedAt).toLocaleDateString()}
												</span>
											)}
										</div>
									</div>

									<div className="ml-4 flex items-center gap-2">
										<Button variant="outline" size="sm">
											<Edit className="h-4 w-4" />
										</Button>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="outline" size="sm">
													<Trash2 className="h-4 w-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Delete Token</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to delete &quot;{token.id}&quot;? This
														action cannot be undone and may break API functionality.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
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
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
