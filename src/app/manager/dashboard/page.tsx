
"use client"

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle, Clock, XCircle, ListTodo, AlertTriangle, Activity } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import type { Task } from "@/lib/data"
import { format, isToday, parseISO, isSameDay, compareDesc } from 'date-fns';
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { TeamChat } from "@/components/team-chat"
import TaskModel from '@/models/Task';

const chartData = [
  { month: "January", completed: 186 },
  { month: "February", completed: 305 },
  { month: "March", completed: 237 },
  { month: "April", completed: 273 },
  { month: "May", completed: 209 },
  { month: "June", completed: 214 },
]

const chartConfig = {
  completed: {
    label: "Tasks Completed",
    color: "hsl(var(--primary))",
  },
}

async function getTasks() {
    try {
        const tasks = await TaskModel.find({}).lean();
        return JSON.parse(JSON.stringify(tasks));
    } catch (error) {
        console.error("Failed to fetch tasks", error);
        return [];
    }
}

export default function ManagerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
      async function loadData() {
          const tasksData = await getTasks();
          setTasks(tasksData);
      }
      loadData();
  }, []);
    
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
  const blockedTasks = tasks.filter(t => t.status === "Blocked");

  const today = new Date();
  const tasksDueToday = tasks.filter(t => isSameDay(parseISO(t.dueDate), today));
  
  const recentActivity = tasks
    .filter(t => t.status === 'Completed')
    .sort((a, b) => compareDesc(parseISO(a.dueDate), parseISO(b.dueDate)))
    .slice(0, 5);


  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of team performance and project status.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Tasks
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">
                {tasks.length} total tasks
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocked Tasks</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blockedTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                Needs immediate attention
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
           <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ListTodo className="text-primary" /> Today's Agenda</CardTitle>
                  <CardDescription>Tasks due today, {format(today, 'PPP')}.</CardDescription>
              </CardHeader>
              <CardContent>
                  {tasksDueToday.length > 0 ? (
                      <ul className="space-y-3">
                          {tasksDueToday.map(task => (
                               <li key={task.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                  <div>
                                      <Link href={`/tasks/${task.id}`} className="font-medium hover:underline">{task.title}</Link>
                                      <p className="text-sm text-muted-foreground">{task.assignees.join(', ')}</p>
                                  </div>
                                  <Badge variant="secondary">{task.client}</Badge>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <p className="text-center text-muted-foreground py-4">No tasks due today.</p>
                  )}
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" /> Action Required</CardTitle>
                  <CardDescription>Tasks that are currently blocked.</CardDescription>
              </CardHeader>
              <CardContent>
                   {blockedTasks.length > 0 ? (
                      <ul className="space-y-3">
                          {blockedTasks.map(task => (
                              <li key={task.id} className="flex items-center justify-between p-2 rounded-md bg-destructive/10">
                                  <div>
                                      <Link href={`/tasks/${task.id}`} className="font-medium hover:underline">{task.title}</Link>
                                      <p className="text-sm text-muted-foreground">{task.assignees.join(', ')}</p>
                                  </div>
                                  <Badge variant="destructive">{task.client}</Badge>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <p className="text-center text-muted-foreground py-4">No blocked tasks.</p>
                  )}
              </CardContent>
          </Card>
        </div>

         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Activity className="text-primary" /> Recent Activity</CardTitle>
                  <CardDescription>Recently completed tasks by the team.</CardDescription>
              </CardHeader>
              <CardContent>
                  {recentActivity.length > 0 ? (
                       <ul className="space-y-3">
                          {recentActivity.map(task => (
                               <li key={task.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                  <div>
                                      <Link href={`/tasks/${task.id}`} className="font-medium hover:underline">{task.title}</Link>
                                      <p className="text-sm text-muted-foreground">Completed by {task.assignees.join(', ')}</p>
                                  </div>
                                  <Badge variant="outline" className="text-green-600 border-green-600/50">Completed</Badge>
                              </li>
                          ))}
                      </ul>
                  ) : (
                       <p className="text-center text-muted-foreground py-4">No recent activity.</p>
                  )}
              </CardContent>
          </Card>
         </div>
      </div>
      <div className="lg:col-span-1">
        <TeamChat userId="1" />
      </div>
    </div>
  )
}
