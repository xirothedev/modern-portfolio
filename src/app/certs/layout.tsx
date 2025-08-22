import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Certifications",
};

export default function CertsLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
