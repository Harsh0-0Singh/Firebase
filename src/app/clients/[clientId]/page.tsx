import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { tasks } from "@/lib/data";
import { CheckCircle, GanttChartSquare, Globe, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientTaskRequestForm } from "./_components/client-task-request-form";

export default function ClientPortalPage({ params }: { params: { clientId: string } }) {
  const clientName = "Innovate Corp"; // Mock client name
  const clientTasks = tasks.filter((task) => task.client === clientName);
  const completedTasks = clientTasks.filter((task) => task.status === "Completed").length;
  const totalTasks = clientTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline">Brands in House</h1>
          </div>
          <Link href="/">
             <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Project Progress: {clientName}</CardTitle>
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
                    {clientTasks.map((task, index) => (
                      <div key={task.id} className="relative flex items-start">
                         <div className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                           {task.status === 'Completed' && <CheckCircle className="h-3 w-3 text-white" />}
                         </div>
                        <div>
                          <p className="font-medium">{task.title}</p>
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
      </main>
    </div>
  );
}
