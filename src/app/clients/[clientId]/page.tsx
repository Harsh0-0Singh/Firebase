
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, GanttChartSquare } from "lucide-react";
import Link from "next/link";
import { ClientTaskRequestForm } from "./_components/client-task-request-form";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongoose";
import ClientModel from "@/models/Client";
import TaskModel from "@/models/Task";
import type { Client, Task } from "@/lib/data";

async function getClientData(clientId: string) {
    await connectDB();
    const client = await ClientModel.findOne({ id: clientId }).lean();
    if (!client) {
        return null;
    }
    const tasks = await TaskModel.find({ client: client.name }).lean();

    return {
        client: JSON.parse(JSON.stringify(client)) as Client,
        tasks: JSON.parse(JSON.stringify(tasks)) as Task[],
    }
}


export default async function ClientPortalPage({ params }: { params: { clientId: string } }) {
  const data = await getClientData(params.clientId);

  if (!data) {
      notFound();
  }

  const { client, tasks: clientTasks } = data;

  const completedTasks = clientTasks.filter((task) => task.status === "Completed").length;
  const totalTasks = clientTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Project Progress: {client.name}</CardTitle>
                <CardDescription>
                  A summary of the work being done for your projects.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Overall Progress</h3>
                    <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground mt-2">{completedTasks} of {totalTasks} tasks completed.</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2"><GanttChartSquare className="text-primary"/> Project Timeline</h3>
                  <div className="relative border-l-2 border-primary/20 pl-6 space-y-8">
                    {clientTasks.map((task) => (
                      <div key={task.id} className="relative flex items-start">
                         <div className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                           {task.status === 'Completed' && <CheckCircle className="h-3 w-3 text-white" />}
                         </div>
                        <div>
                           <Link href={`/tasks/${task.id}`} className="font-medium hover:underline">{task.title}</Link>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                           <time className="text-xs text-muted-foreground/80">Due: {task.dueDate}</time>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
        <div>
            <ClientTaskRequestForm />
        </div>
    </div>
  );
}
