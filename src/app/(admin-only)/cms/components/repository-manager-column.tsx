"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Shield, ShieldCheck, ShieldX, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";

interface RepositoryManagerData {
	name: string;
	slug: string;
	createdAt: Date;
}

export const columns: ColumnDef<RepositoryManagerData>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "slug",
		header: "Slug",
	},
	{
		accessorKey: "createdAt",
		header: () => <div>Create at</div>,
		cell: ({ row }) => {
			const formatted = format(row.getValue("createdAt"), "Pp");

			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: () => {
			// const user = row.original;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const router = useRouter();

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
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<UserCog className="mr-2 h-4 w-4" />
									Manage Role
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="border-zinc-700 bg-zinc-900/95 text-white backdrop-blur-sm">
									<DropdownMenuLabel>Change role</DropdownMenuLabel>
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={async () => {
											// await setRole({ userId: user.id, role: "admin" });
											router.refresh();
										}}
									>
										<ShieldCheck className="mr-2 h-4 w-4 text-red-400" />
										Set as Admin
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={async () => {
											// await setRole({ userId: user.id, role: "moderator" });
											router.refresh();
										}}
									>
										<Shield className="mr-2 h-4 w-4 text-blue-400" />
										Set as Moderator
									</DropdownMenuItem>
									<DropdownMenuSeparator className="bg-zinc-700" />
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={async () => {
											// await removeRole({ userId: user.id });
											router.refresh();
										}}
									>
										<ShieldX className="mr-2 h-4 w-4 text-gray-400" />
										Remove Role
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="cursor-pointer"
								// onClick={() => navigator.clipboard.writeText(user.id)}
							>
								Copy user ID
							</DropdownMenuItem>
							<DropdownMenuItem
								// onClick={() => navigator.clipboard.writeText(JSON.stringify(user.raw, null, 2))}
								className="cursor-pointer"
							>
								Copy user json
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
