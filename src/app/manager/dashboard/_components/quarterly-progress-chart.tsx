
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";


const chartData = [
  { month: "January", completed: 186 },
  { month: "February", completed: 305 },
  { month: "March", completed: 237 },
  { month: "April", completed: 273 },
  { month: "May", completed: 209 },
  { month: "June", completed: 214 },
];

const chartConfig = {
  completed: {
    label: "Tasks Completed",
    color: "hsl(var(--primary))",
  },
};

export function QuarterlyProgressChart() {
    return (
        <Card>
            <CardHeader>
              <CardTitle>Quarterly Progress</CardTitle>
              <CardDescription>
                Number of tasks completed each month.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <RechartsBarChart data={chartData} accessibilityLayer>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                   <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
    )
}
