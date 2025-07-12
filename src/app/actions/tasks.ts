
'use server';

import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';
import connectDB from '@/lib/mongoose';
import TaskModel from '@/models/Task';
import MessageModel from '@/models/Message';
import type { Task, TaskStatus, NotificationMessage } from '@/lib/data';

export async function getTasksForManager() {
    try {
        await connectDB();
        const tasks = await TaskModel.find({}).lean();
        return JSON.parse(JSON.stringify(tasks));
    } catch (error) {
        console.error("Failed to fetch tasks", error);
        return [];
    }
}

export async function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    try {
        await connectDB();
        await TaskModel.findOneAndUpdate({ id: taskId }, { status: newStatus });
        revalidatePath('/manager/tasks');
        return { success: true };
    } catch (error) {
        console.error("Failed to update task status", error);
        return { success: false, error: 'Failed to update status' };
    }
}

export async function updateTaskStatusForEmployee(taskId: string, newStatus: TaskStatus) {
    try {
        await connectDB();
        await TaskModel.findOneAndUpdate({ id: taskId }, { status: newStatus });
        revalidatePath('/employee/[employeeId]/tasks', 'page');
        return { success: true };
    } catch (error) {
        console.error("Failed to update task status", error);
        return { success: false, error: 'Failed to update status' };
    }
}


export async function submitTaskRating(taskId: string, rating: number, title: string) {
     try {
        await connectDB();
        await TaskModel.findOneAndUpdate({ id: taskId }, { rating: rating });
        revalidatePath('/manager/tasks');
        return { success: true };
    } catch (error) {
        console.error("Failed to submit rating", error);
        return { success: false, error: 'Failed to submit rating' };
    }
}

export async function createTask(newTaskData: Omit<Task, '_id' | 'id' | 'comments'>) {
    try {
        await connectDB();
        const tasksCount = await TaskModel.countDocuments();
        const newTaskId = `T${tasksCount + 1}`;
        
        const finalTaskData = {
            ...newTaskData,
            id: newTaskId,
            comments: [],
        }

        const messagesCount = await MessageModel.countDocuments();
        const newNotificationData: NotificationMessage = {
            id: `M${messagesCount + 1}`,
            type: 'notification',
            content: `created a new task "${finalTaskData.title}" and assigned it to ${finalTaskData.assignees.join(', ')}.`,
            authorId: '1', // Alex Doe
            timestamp: new Date().toISOString(),
            taskId: finalTaskData.id,
        };

        const newTask = new TaskModel(finalTaskData);
        const newNotification = new MessageModel(newNotificationData);
        
        await Promise.all([
            newTask.save(),
            newNotification.save()
        ]);
        
        revalidatePath('/manager/tasks');
        return { success: true, task: JSON.parse(JSON.stringify(finalTaskData)) };

    } catch (error) {
        console.error("Failed to create task", error);
        return { success: false, error: 'Failed to create task' };
    }
}
