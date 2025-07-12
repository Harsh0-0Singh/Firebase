
import connectDB from '@/lib/mongoose';
import TaskModel from '@/models/Task';
import EmployeeModel from '@/models/Employee';
import ClientModel from '@/models/Client';
import { notFound } from 'next/navigation';
import { TaskDetailPageContent } from './_components/task-detail-content';
import type { Task, Employee, Client } from '@/lib/data';
import { cookies } from 'next/headers';

// This is a placeholder for a real auth system.
// In a real app, you'd get this from a session cookie.
function getLoginInfo(): { user: Employee | Client, role: 'Manager' | 'Employee' | 'Client' } | null {
    const cookieStore = cookies();
    const loginCookie = cookieStore.get('login_info');
    if (loginCookie) {
        try {
            const parsed = JSON.parse(loginCookie.value);
            return parsed.user && parsed.role ? parsed : null;
        } catch (e) {
            return null;
        }
    }
    return null;
}

export default async function TaskDetailPage({ params }: { params: { taskId: string } }) {
    await connectDB();
    
    const taskData = await TaskModel.findOne({ id: params.taskId }).lean();
    if (!taskData) {
        notFound();
    }
    
    const [employeesData, clientsData] = await Promise.all([
        EmployeeModel.find({}).lean(),
        ClientModel.find({}).lean()
    ]);


    // Ensure data is serialized to plain objects
    const task = JSON.parse(JSON.stringify(taskData)) as Task;
    const allEmployees = JSON.parse(JSON.stringify(employeesData)) as Employee[];
    const allClients = JSON.parse(JSON.stringify(clientsData)) as Client[];

    const loginInfo = getLoginInfo();
    const currentUser = loginInfo ? loginInfo.user : null;
    const currentUserRole = loginInfo ? loginInfo.role : null;
    
    const taskClient = allClients.find(c => c.name === task.client) || null;

    // Determine if the current user can comment
    let canComment = false;
    if (currentUser) {
        const isManager = currentUserRole === 'Manager';
        const isAssignedEmployee = currentUserRole === 'Employee' && task.assignees.includes(currentUser.name);
        const isTaskClient = currentUserRole === 'Client' && taskClient?.id === currentUser.id;
        canComment = isManager || isAssignedEmployee || isTaskClient;
    }

    return (
        <TaskDetailPageContent 
            initialTask={task} 
            allEmployees={allEmployees} 
            currentUser={currentUser} 
            canComment={canComment} 
        />
    );
}
