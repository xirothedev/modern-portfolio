"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Dispatch, SetStateAction, createContext, useState } from "react";
import { UseFormSetValue, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { zodRepoName, zodSlug } from "@/lib/zod";

import { cn } from "@/lib/utils";
import { addProject, updateProject } from "../actions";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

const projectSchema = z.object({
	id: z.string().optional(),
	repoName: zodRepoName,
	slug: zodSlug,
});

export type ProjectForm = z.infer<typeof projectSchema>;

interface RepositoryManagerDialogContextProps {
	setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
	setIsEdit: Dispatch<SetStateAction<boolean>>;
	setValue: UseFormSetValue<ProjectForm>;
}
export const RepositoryManagerDialogContext = createContext<RepositoryManagerDialogContextProps>({
	setIsDialogOpen: () => false,
	setIsEdit: () => false,
	setValue: () => {},
});

export function RepositoryManagerTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);

	const router = useRouter();
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
	} = useForm<ProjectForm>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			repoName: "",
			slug: "",
		},
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	const onSubmit = async (data: ProjectForm) => {
		setIsSubmitting(true);

		try {
			let result;

			if (isEdit) {
				if (!data.id) {
					throw new Error("Project id is not provided");
				}
				result = await updateProject(data.id, { repoName: data.repoName, slug: data.slug });
			} else {
				result = await addProject({ repoName: data.repoName, slug: data.slug });
			}

			if (result.success) {
				toast({
					title: isEdit ? "Project Updated" : "Project Created",
					description: result.message || `${isEdit ? "Updated" : "Created"} project successfully!`,
				});
				setIsDialogOpen(false);
				router.refresh();
				void reset();
			} else {
				toast({
					title: "Error",
					description: result.message || "An error occurred while processing your request.",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			toast({
				title: "Unexpected Error",
				description: "An unexpected error occurred. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<RepositoryManagerDialogContext.Provider value={{ setIsDialogOpen, setIsEdit, setValue }}>
			<div className="w-full">
				<div className="flex items-center py-4">
					<Input
						placeholder="Filter name..."
						value={(table.getColumn("repoName")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("repoName")?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
					<div className="ml-auto">
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button
									onClick={() => {
										setIsEdit(false);
										reset();
									}}
									variant="outline"
								>
									Create
								</Button>
							</DialogTrigger>
							<DialogContent showCloseButton={false} className="sm:max-w-[425px]">
								<form onSubmit={handleSubmit(onSubmit)}>
									<DialogHeader>
										<DialogTitle>{isEdit ? "Edit" : "Create"} project</DialogTitle>
										<DialogDescription>
											{isEdit ? "Edit" : "Create"} a project record
										</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4">
										<div className="grid gap-3">
											<Label htmlFor="project-name">Repository name (owner/repoName)</Label>
											<Input
												id="project-repoName"
												placeholder="xirothedev/modern-portfolio"
												{...register("repoName")}
												aria-invalid={!!errors.repoName}
												aria-describedby={errors.repoName ? "repoName-error" : undefined}
												disabled={isSubmitting}
											/>
											{errors.repoName && (
												<p id="repoName-error" className="text-sm text-red-500">
													{errors.repoName.message}
												</p>
											)}
										</div>
										<div className="grid gap-3">
											<Label htmlFor="project-slug">Slug</Label>
											<Input
												id="project-slug"
												placeholder="abc-xyz"
												{...register("slug")}
												aria-invalid={!!errors.slug}
												aria-describedby={errors.slug ? "slug-error" : undefined}
												disabled={isSubmitting}
											/>
											{errors.slug && (
												<p id="slug-error" className="text-sm text-red-500">
													{errors.slug.message}
												</p>
											)}
										</div>
									</div>
									<DialogFooter className="mt-2">
										<DialogClose asChild>
											<Button type="button" variant="outline" disabled={isSubmitting}>
												Cancel
											</Button>
										</DialogClose>
										<Button type="submit" variant="primary" disabled={isSubmitting}>
											{isSubmitting ? "Processing..." : isEdit ? "Update" : "Create"}
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="ml-2" variant="outline">
								Columns <ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="border-zinc-700 bg-zinc-900/95 text-white backdrop-blur-sm"
							align="end"
						>
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="cursor-pointer capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) => column.toggleVisibility(!!value)}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 shadow-xl backdrop-blur-sm">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id} className="border-zinc-800 hover:bg-zinc-800/30">
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												className="border-zinc-700 bg-zinc-800/50 px-4 py-3 font-semibold text-white"
												key={header.id}
											>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row, index) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
										className={cn(
											"border-zinc-800 transition-colors duration-200",
											index % 2 === 0
												? "bg-zinc-900/30 hover:bg-zinc-800/40"
												: "bg-zinc-900/50 hover:bg-zinc-800/50",
										)}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className="border-zinc-800 px-4 py-3 text-zinc-100"
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 border-zinc-800 text-center text-zinc-400"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</RepositoryManagerDialogContext.Provider>
	);
}
