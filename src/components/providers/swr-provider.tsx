"use client";

import { swrConfig } from "@/lib/swr-config";
import { SWRConfig } from "swr";

interface SWRProviderProps {
	children: React.ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
	return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
