'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { tasks, employees, clients } from "@/lib/data";
import { TeamPerformanceChart } from "./_components/team-performance-chart";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const overallCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const ratedTasks = tasks.filter(t => t.rating > 0);
    const averageRating = ratedTasks.length > 0 
        ? ratedTasks.reduce((acc, t) => acc + t.rating, 0) / ratedTasks.length
        : 0;

    const employeePerformance = employees.map(employee => {
        const assignedTasks = tasks.filter(t => t.assignees.includes(employee.name));
        const completed = assignedTasks.filter(t => t.status === 'Completed').length;
        return {
            name: employee.name,
            completedTasks: completed
        };
    });

    const clientProgress = clients.map(client => {
        const clientTasks = tasks.filter(t => t.client === client.name);
        const completed = clientTasks.filter(t => t.status === 'Completed').length;
        const total = clientTasks.length;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        return {
            name: client.name,
            completed,
            total,
            progress
        }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Performance Reports</h1>
                <p className="text-muted-foreground">
                    A comprehensive overview of team and project performance.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTasks}</div>
                        <p className="text-xs text-muted-foreground">Across all projects</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(overallCompletionRate)}%</div>
                         <p className="text-xs text-muted-foreground">{completedTasks} of {totalTasks} tasks completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg. Task Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageRating.toFixed(1)} / 5.0</div>
                         <p className="text-xs text-muted-foreground">Based on {ratedTasks.length} rated tasks</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Team Performance</CardTitle>
                    <CardDescription>Number of completed tasks per employee.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TeamPerformanceChart data={employeePerformance} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Client Project Progress</CardTitle>
                    <CardDescription>Overview of task completion for each client.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {clientProgress.map(client => (
                        <div key={client.name}>
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium">{client.name}</h4>
                                <span className="text-sm text-muted-foreground">{client.completed} / {client.total} tasks</span>
                            </div>
                            <Progress value={client.progress} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
