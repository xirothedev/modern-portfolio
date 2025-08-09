import { Metadata } from "next";

export const metadata: Metadata = {
	title: "CMS dashboard",
	robots: {
		index: false,
		follow: false,
	},
};

export default function CMSLayout({ children }: { children: React.ReactNode }) {
	return <div className="min-h-screen bg-linear-to-b from-zinc-900 via-zinc-900 to-black">{children}</div>;
}
