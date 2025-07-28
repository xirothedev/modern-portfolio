export default function List({ data }: { data: React.ReactNode[] }) {
	return (
		<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
			{data.map((item, idx) => (
				<li key={idx}>{item}</li>
			))}
		</ul>
	);
}
