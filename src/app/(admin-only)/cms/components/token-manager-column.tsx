"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Token } from "generated/prisma";
import { Activity, Edit, MoreHorizontal, Trash2 } from "lucide-react";

import { useContext } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TokenManagerDialogContext } from "./token-manager-table";

export const columns: ColumnDef<Token>[] = [
	{
		accessorKey: "id",
		header: "Token ID",
		cell: ({ row }) => {
			return <span className="font-medium text-white">{row.getValue("id")}</span>;
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const token = row.original;
			return (
				<div className="flex items-center gap-2">
					<Badge variant={!token.isRevoked ? "default" : "secondary"} className="bg-zinc-700 text-zinc-100">
						{!token.isRevoked ? "Active" : "Revoked"}
					</Badge>
					{token.isUsed && (
						<Badge variant="outline">
							<Activity className="mr-1 h-3 w-3" />
							Used
						</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "scope",
		header: "Scope",
		cell: ({ row }) => {
			return (
				<Badge variant="outline" className="bg-zinc-700 text-xs text-zinc-100">
					{row.getValue("scope")}
				</Badge>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: () => <div>Created At</div>,
		cell: ({ row }) => {
			const formatted = format(row.getValue("createdAt"), "Pp");
			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "expireAt",
		header: () => <div>Expires At</div>,
		cell: ({ row }) => {
			const expireAt = row.getValue("expireAt") as Date | null;
			if (!expireAt) {
				return <div className="text-zinc-500">Never</div>;
			}
			const formatted = format(expireAt, "Pp");
			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "usedAt",
		header: () => <div>Used At</div>,
		cell: ({ row }) => {
			const token = row.original;
			if (!token.isUsed || !token.usedAt) {
				return <div className="text-zinc-500">-</div>;
			}
			const formatted = format(token.usedAt, "Pp");
			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "usedBy",
		header: () => <div>Used By</div>,
		cell: ({ row }) => {
			const usedBy = row.getValue("usedBy") as string | null;
			return (
				<div className="flex items-center gap-2">
					{usedBy ? (
						<span className="text-sm text-zinc-400">{usedBy}</span>
					) : (
						<span className="text-sm text-zinc-500">-</span>
					)}
				</div>
			);
		},
	},
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => {
			const token = row.original;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { setIsDialogOpen, setIsEdit, setValue, handleDelete } = useContext(TokenManagerDialogContext);

			return (
				<div className="flex justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="border-zinc-700 bg-zinc-900/95 text-white" align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => {
									setValue("id", token.id);
									setValue("scope", token.scope);
									setValue("expireAt", token.expireAt);
									setValue("projectId", token.projectId);
									setIsEdit(true);
									setIsDialogOpen(true);
								}}
							>
								<Edit className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer text-red-500"
								onClick={() => handleDelete(token.id)}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
