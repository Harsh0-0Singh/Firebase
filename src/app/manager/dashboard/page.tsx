"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { BarChart, CheckCircle, Clock, XCircle, Calendar as CalendarIcon, ListTodo } from "lucide-react"
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
import { tasks, Task } from "@/lib/data"
import { addDays, isSameDay, isToday, parseISO } from 'date-fns';
import { Badge } from "@/components/ui/badge"

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

export default function ManagerDashboard() {
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
  const blockedTasks = tasks.filter(t => t.status === "Blocked").length;

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([])
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([])
  
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = task.dueDate;
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  useEffect(() => {
    const today = new Date();
    const filteredTodaysTasks = tasks.filter(task => isToday(parseISO(task.dueDate)));
    setTodaysTasks(filteredTodaysTasks);

    if (date) {
      const filteredSelectedDayTasks = tasks.filter(task => isSameDay(parseISO(task.dueDate), date));
      setSelectedDayTasks(filteredSelectedDayTasks);
    } else {
        setSelectedDayTasks([]);
    }
  }, [date]);

  const DayWithTasks = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().split('T')[0];
    const dayTasks = tasksByDate[dateString] || [];
    const taskCount = dayTasks.length;

    let colorClass = "";
    if (taskCount > 0) {
      if (taskCount >= 3) colorClass = "bg-red-200 dark:bg-red-800";
      else if (taskCount >= 2) colorClass = "bg-yellow-200 dark:bg-yellow-800";
      else colorClass = "bg-green-200 dark:bg-green-800";
    }

    return (
      <div className={`relative h-full w-full flex items-center justify-center rounded-md ${colorClass}`}>
        <span>{date.getDate()}</span>
        {taskCount > 0 && 
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {taskCount}
            </div>
        }
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of team performance and project status.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="text-2xl font-bold">{blockedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Needs immediate attention
            </p>
          </CardContent>
        </Card>
      </div>
      
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ListTodo /> Today's Tasks
            </CardTitle>
        </CardHeader>
        <CardContent>
            {todaysTasks.length > 0 ? (
                <ul className="space-y-2">
                    {todaysTasks.map(task => (
                        <li key={task.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                            <div>
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-muted-foreground">{task.assignee}</p>
                            </div>
                            <Badge variant={task.status === "Completed" ? "default" : "secondary"}>{task.status}</Badge>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">No tasks due today.</p>
            )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Calendar</CardTitle>
             <CardDescription>
              Calendar view of upcoming deadlines. Click a date to view tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-0"
              components={{
                Day: ({ date }) => <DayWithTasks date={date} />,
              }}
              classNames={{
                head_cell: "w-full",
                cell: "w-full",
                day: "w-full h-12",
                day_selected: "bg-primary/20 text-primary-foreground",
              }}
            />
          </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarIcon /> Tasks for {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : '...'}
                </CardTitle>
                <CardDescription>
                    {selectedDayTasks.length} task(s) scheduled for this day.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {selectedDayTasks.length > 0 ? (
                    <ul className="space-y-3">
                        {selectedDayTasks.map(task => (
                            <li key={task.id} className="p-3 rounded-lg border bg-card">
                                <p className="font-semibold">{task.title}</p>
                                <p className="text-sm text-muted-foreground">Assignee: {task.assignee}</p>
                                <Badge variant="outline" className="mt-2">{task.status}</Badge>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-center pt-8">No tasks for the selected date.</p>
                )}
            </CardContent>
        </Card>
      </div>

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
    </div>
  )
}
