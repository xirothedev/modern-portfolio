"use client";

import { BarChart3, Database, Key } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { useState } from "react";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const tabs = [
	{ value: "repositories", icon: <Database className="h-4 w-4" />, label: "Repositories" },
	{ value: "tokens", icon: <Key className="h-4 w-4" />, label: "Tokens" },
	{ value: "analytics", icon: <BarChart3 className="h-4 w-4" />, label: "Analytics" },
] as const;

type TabValue = (typeof tabs)[number]["value"];

export default function ClientTabs() {
	const [hovered, setHovered] = useState<string | null>(null);
	const [active, setActive] = useState<TabValue>("repositories");

	return (
		<div className="relative">
			<TabsList className="relative grid h-10 w-full grid-cols-3 overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-1 shadow backdrop-blur-sm lg:w-auto lg:grid-cols-3">
				<AnimatePresence>
					{(hovered || active) && (
						<motion.span
							layoutId="tab-highlight"
							className="absolute z-0 h-[30px] w-[calc(1/3*100%-0.65%)] rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
							style={{
								left: `${tabs.findIndex((t) => t.value === (hovered || active)) * 33.3333 + 0.35}%`,
								top: 4,
							}}
							initial={{ opacity: 0.7 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
						/>
					)}
				</AnimatePresence>

				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.value}
						value={tab.value}
						className={cn(
							"relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-1 transition-all duration-200",
							active === tab.value
								? "bg-transparent! font-bold text-white"
								: "bg-transparent text-zinc-400",
						)}
						onMouseEnter={() => setHovered(tab.value)}
						onMouseLeave={() => setHovered(null)}
						onClick={() => setActive(tab.value)}
					>
						{tab.icon}
						<span className="hidden sm:inline">{tab.label}</span>
					</TabsTrigger>
				))}
			</TabsList>
		</div>
	);
}
