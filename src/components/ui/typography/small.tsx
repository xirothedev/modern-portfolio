export default function Lead({ children }: { children: React.ReactNode }) {
	return <small className="text-sm leading-none font-medium">{children}</small>;
}
