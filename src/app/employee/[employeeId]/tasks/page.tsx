
import { notFound } from "next/navigation";
import { getTasksForEmployee } from '@/app/actions/tasks';
import { EmployeeTasksPageContent } from "./_components/employee-tasks-page-content";


export default async function EmployeeTasksPage({ params }: { params: { employeeId: string }}) {
    const tasks = await getTasksForEmployee(params.employeeId);

    if (tasks === null) {
        notFound();
    }
    
    return <EmployeeTasksPageContent initialTasks={tasks} />;
}
