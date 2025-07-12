
import { notFound } from "next/navigation";
import { getTasksForEmployee } from '@/app/actions/tasks';
import { EmployeeTasksPageContent } from "./_components/employee-tasks-page-content";


export default async function EmployeeTasksPage({ params }: { params: { employeeId: string }}) {
    const tasksData = await getTasksForEmployee(params.employeeId);

    if (tasksData === null) {
        notFound();
    }
    
    // Ensure tasks are plain objects before passing to the client component
    const tasks = JSON.parse(JSON.stringify(tasksData));
    
    return <EmployeeTasksPageContent initialTasks={tasks} />;
}
