import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface TypographyTableProps {
	data: Array<Record<string, React.ReactNode>>;
}

export function TypoTable({ data }: TypographyTableProps) {
	if (!data || data.length === 0) return null;

	const headers = Object.keys(data[0]);

	return (
		<div className="my-6 w-full overflow-y-auto">
			<Table>
				<TableHeader>
					<TableRow>
						{headers.map((header) => (
							<TableHead key={header}>{header}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row, i) => (
						<TableRow key={i}>
							{headers.map((header) => (
								<TableCell key={header}>{row[header]}</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
