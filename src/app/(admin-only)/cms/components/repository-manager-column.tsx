"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useContext } from "react";
import { RepositoryManagerDialogContext } from "./repository-manager-table";

interface RepositoryManagerData {
	id: string;
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
		cell: ({ row }) => {
			const project = row.original;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { setIsDialogOpen, setIsEdit, setValue } = useContext(RepositoryManagerDialogContext);

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
									setValue("id", project.id);
									setValue("name", project.name);
									setValue("slug", project.slug);
									setIsEdit(true);
									setIsDialogOpen(true);
								}}
							>
								Update
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() =>
									navigator.clipboard.writeText(
										`${process.env.NEXT_PUBLIC_BASE_URL}/repository/${project.slug}`,
									)
								}
							>
								Copy link without token
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
