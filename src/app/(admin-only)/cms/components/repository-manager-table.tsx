"use client";

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
import { zodSlug } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { useForm, UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import { addProject, updateProject } from "../actions";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

const projectSchema = z.object({
	id: z.string().optional(),
	name: zodSlug,
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
	const [isEdit, setIsEdit] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
	} = useForm<ProjectForm>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			name: "",
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
		if (isEdit) {
			if (!data.id) {
				throw new Error("Project id is not provided");
			}
			updateProject(data.id, { repoName: data.name, slug: data.slug });
		} else {
			addProject({ repoName: data.name, slug: data.slug });
		}
	};

	return (
		<RepositoryManagerDialogContext.Provider value={{ setIsDialogOpen, setIsEdit, setValue }}>
			<div className="w-full">
				<div className="flex items-center py-4">
					<Input
						placeholder="Filter name..."
						value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
					<form className="ml-auto" onSubmit={handleSubmit(onSubmit)}>
						<Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)}>
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
								<DialogHeader>
									<DialogTitle>{isEdit ? "Edit" : "Create"} project</DialogTitle>
									<DialogDescription>{isEdit ? "Edit" : "Create"} a project record</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4">
									<div className="grid gap-3">
										<Label htmlFor="project-name">Name</Label>
										<Input
											id="project-name"
											placeholder="xirothedev/modern-portfolio"
											{...register("name")}
											aria-invalid={!!errors.name}
											aria-describedby={errors.name ? "name-error" : undefined}
										/>
										{errors.name && (
											<p id="name-error" className="text-sm text-red-500">
												{errors.name.message}
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
										/>
										{errors.slug && (
											<p id="slug-error" className="text-sm text-red-500">
												{errors.slug.message}
											</p>
										)}
									</div>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<Button type="submit" variant="primary">
										{isEdit ? "Update" : "Create"}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</form>
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
										className={`border-zinc-800 transition-colors duration-200 ${
											index % 2 === 0
												? "bg-zinc-900/30 hover:bg-zinc-800/40"
												: "bg-zinc-900/50 hover:bg-zinc-800/50"
										}`}
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
