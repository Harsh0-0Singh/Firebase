'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip as ChartTooltipComponent,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface TeamPerformanceChartProps {
    data: {
        name: string;
        completedTasks: number;
    }[];
}

const chartConfig = {
  completedTasks: {
    label: "Completed Tasks",
    color: "hsl(var(--primary))",
  },
} satisfies import("@/components/ui/chart").ChartConfig


export function TeamPerformanceChart({ data }: TeamPerformanceChartProps) {
    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <ChartTooltipComponent
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="completedTasks" fill="var(--color-completedTasks)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
