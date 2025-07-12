
import connectDB from '@/lib/mongoose';
import TaskModel from '@/models/Task';
import EmployeeModel from '@/models/Employee';
import { notFound } from 'next/navigation';
import { TaskDetailPageContent } from './_components/task-detail-content';
import type { Task, Employee } from '@/lib/data';

export default async function TaskDetailPage({ params }: { params: { taskId: string } }) {
    await connectDB();
    
    const taskData = await TaskModel.findOne({ id: params.taskId }).lean();
    if (!taskData) {
        notFound();
    }
    
    const employeesData = await EmployeeModel.find({}).lean();

    // Ensure data is serialized to plain objects
    const task = JSON.parse(JSON.stringify(taskData)) as Task;
    const allEmployees = JSON.parse(JSON.stringify(employeesData)) as Employee[];

    return <TaskDetailPageContent initialTask={task} allEmployees={allEmployees} />;
}
