
'use server';

import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';
import connectDB from '@/lib/mongoose';
import TaskRequestModel from '@/models/TaskRequest';
import TaskModel from '@/models/Task';
import MessageModel from '@/models/Message';
import EmployeeModel from '@/models/Employee';
import type { Task, NotificationMessage, TaskRequest, Employee } from '@/lib/data';

async function getManager(): Promise<Employee | null> {
    await connectDB();
    const manager = await EmployeeModel.findOne({ role: 'Manager' }).lean();
    return manager ? JSON.parse(JSON.stringify(manager)) : null;
}

export async function getPendingTaskRequests() {
    try {
        await connectDB();
        const requests = await TaskRequestModel.find({ status: 'Pending' }).lean();
        return JSON.parse(JSON.stringify(requests));
    } catch (error) {
        console.error("Failed to fetch task requests", error);
        return [];
    }
}

export async function approveRequest(request: TaskRequest, assignees: string[]) {
    try {
        await connectDB();
        const manager = await getManager();

        if (!manager) {
            throw new Error("Manager not found");
        }

        const tasksCount = await TaskModel.countDocuments();
        const newTaskId = `T${tasksCount + 1}`;

        const newTaskData: Omit<Task, '_id' | 'comments'> = {
            id: newTaskId,
            title: request.title,
            description: request.description,
            assignees: assignees,
            client: request.client,
            dueDate: format(new Date(), 'yyyy-MM-dd'), // Placeholder, should be settable
            status: 'Pending',
            rating: 0,
            createdBy: manager.name,
            createdAt: format(new Date(), 'yyyy-MM-dd'),
        };

        const messagesCount = await MessageModel.countDocuments();
        const newNotificationData: NotificationMessage = {
            id: `M${messagesCount + 1}`,
            type: 'notification',
            content: `approved request "${newTaskData.title}" and assigned it to ${newTaskData.assignees.join(', ')}.`,
            authorId: manager.id,
            timestamp: new Date().toISOString(),
            taskId: newTaskId,
        };

        const newTask = new TaskModel(newTaskData);
        const newNotification = new MessageModel(newNotificationData);

        await Promise.all([
            newTask.save(),
            newNotification.save(),
            TaskRequestModel.findByIdAndUpdate(request._id, { status: 'Approved' })
        ]);

        revalidatePath('/manager/requests');
        revalidatePath('/manager/dashboard');
        revalidatePath('/manager/tasks');
        return { success: true };
    } catch (error) {
        console.error("Failed to approve task", error);
        return { success: false, error: "Could not approve the task." };
    }
}

export async function rejectRequest(request: TaskRequest) {
    try {
        await connectDB();
        await TaskRequestModel.findByIdAndUpdate(request._id, { status: 'Rejected' });
        revalidatePath('/manager/requests');
        return { success: true };
    } catch (error) {
        console.error("Failed to reject task", error);
        return { success: false, error: "Could not reject the task." };
    }
}
