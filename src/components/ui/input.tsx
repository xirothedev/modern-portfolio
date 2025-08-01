import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"flex h-9 w-full min-w-0 rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-1 text-sm text-zinc-100 shadow-xs transition-all duration-200 outline-none placeholder:text-zinc-400",
				"file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-100",
				"selection:bg-purple-500/20 selection:text-zinc-100",
				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
				"focus-visible:border-purple-500 focus-visible:ring-[3px] focus-visible:ring-purple-500/20",
				"aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
				"hover:border-zinc-600 hover:bg-zinc-800/70",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
