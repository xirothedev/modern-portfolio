"use client";

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function UserDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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

	return (
		<div className="w-full">
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter emails..."
					value={(table.getColumn("emailAddress")?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn("emailAddress")?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className="ml-auto border-zinc-700 bg-zinc-800/50 text-zinc-100 transition-colors hover:bg-zinc-700/50 hover:text-white"
							variant="outline"
						>
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
										<TableCell key={cell.id} className="border-zinc-800 px-4 py-3 text-zinc-100">
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
					className="border-zinc-700 bg-zinc-800/50 text-zinc-100 transition-colors hover:bg-zinc-700/50 hover:text-white"
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
					className="border-zinc-700 bg-zinc-800/50 text-zinc-100 transition-colors hover:bg-zinc-700/50 hover:text-white"
				>
					Next
				</Button>
			</div>
		</div>
	);
}
