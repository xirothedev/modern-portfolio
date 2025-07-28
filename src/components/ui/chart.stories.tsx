import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "./chart";
import * as Recharts from "recharts";
import { Monitor, Sun, Moon } from "lucide-react";

const meta = {
	title: "UI/Chart",
	component: ChartContainer,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof ChartContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

const data = [
	{ name: "Jan", uv: 400, pv: 2400, amt: 2400 },
	{ name: "Feb", uv: 300, pv: 1398, amt: 2210 },
	{ name: "Mar", uv: 200, pv: 9800, amt: 2290 },
	{ name: "Apr", uv: 278, pv: 3908, amt: 2000 },
	{ name: "May", uv: 189, pv: 4800, amt: 2181 },
	{ name: "Jun", uv: 239, pv: 3800, amt: 2500 },
	{ name: "Jul", uv: 349, pv: 4300, amt: 2100 },
];

const config = {
	uv: {
		label: "UV Index",
		color: "#8884d8",
		icon: Sun,
	},
	pv: {
		label: "Page Views",
		color: "#82ca9d",
		icon: Moon,
	},
	amt: {
		label: "Amount",
		color: "#ffc658",
		icon: Monitor,
	},
};

export const BarChartExample: Story = {
	render: (args) => <ChartContainer {...args} />,
	args: {
		config,
		children: (
			<Recharts.BarChart data={data}>
				<Recharts.CartesianGrid strokeDasharray="3 3" />
				<Recharts.XAxis dataKey="name" />
				<Recharts.YAxis />
				<Recharts.Bar dataKey="uv" fill="var(--color-uv)" />
				<Recharts.Bar dataKey="pv" fill="var(--color-pv)" />
				<Recharts.Bar dataKey="amt" fill="var(--color-amt)" />
				<Recharts.Tooltip content={<ChartTooltipContent />} />
				<Recharts.Legend content={<ChartLegendContent />} />
			</Recharts.BarChart>
		),
	},
};
