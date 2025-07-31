import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Repository Access Portal",
};

export default function RepositoryLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
