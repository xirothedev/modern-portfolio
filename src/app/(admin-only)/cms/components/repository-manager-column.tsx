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
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import { RepositoryManagerDialogContext } from "./repository-manager-table";
import { Project } from "generated/prisma";
import { deleteProject } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Project>[] = [
	{
		accessorKey: "repoName",
		header: "Repository name",
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
		accessorKey: "updateAt",
		header: () => <div>Update at</div>,
		cell: ({ row }) => {
			const formatted = format(row.getValue("updateAt"), "Pp");

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
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { toast } = useToast();
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const router = useRouter();
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const [isDeleting, setIsDeleting] = useState(false);

			const handleDelete = async () => {
				if (
					!confirm(`Are you sure you want to delete project "${project.slug}"? This action cannot be undone.`)
				) {
					return;
				}

				setIsDeleting(true);
				try {
					const result = await deleteProject(project.id);

					if (result.success) {
						toast({
							title: "Project Deleted",
							description: `Project "${project.slug}" has been deleted successfully.`,
						});
						router.refresh();
					} else {
						toast({
							title: "Error",
							description: result.message || "Failed to delete project.",
							variant: "destructive",
						});
					}
				} catch (error) {
					console.error("Error deleting project:", error);
					toast({
						title: "Unexpected Error",
						description: "An unexpected error occurred while deleting the project.",
						variant: "destructive",
					});
				} finally {
					setIsDeleting(false);
				}
			};

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
								onClick={() =>
									navigator.clipboard.writeText(
										`${process.env.NEXT_PUBLIC_BASE_URL}/repository/${project.slug}`,
									)
								}
							>
								Copy link without token
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => {
									setValue("id", project.id);
									setValue("repoName", project.repoName);
									setValue("slug", project.slug);
									setIsEdit(true);
									setIsDialogOpen(true);
								}}
							>
								<Edit className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer text-red-400 hover:text-red-300"
								onClick={handleDelete}
								disabled={isDeleting}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								{isDeleting ? "Deleting..." : "Delete"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
