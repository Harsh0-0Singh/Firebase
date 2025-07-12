
'use server';

import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';
import connectDB from '@/lib/mongoose';
import TaskModel from '@/models/Task';
import MessageModel from '@/models/Message';
import EmployeeModel from '@/models/Employee';
import type { Task, TaskStatus, NotificationMessage, Employee, Comment } from '@/lib/data';

async function getManager(): Promise<Employee | null> {
    await connectDB();
    const manager = await EmployeeModel.findOne({ role: 'Manager' }).lean();
    return manager ? JSON.parse(JSON.stringify(manager)) : null;
}

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

export async function getTasksForEmployee(employeeId: string) {
    try {
        await connectDB();
        const employee = await EmployeeModel.findOne({ id: employeeId }).lean();
        if (!employee) {
            return null;
        }
        const tasks = await TaskModel.find({ assignees: employee.name }).lean();
        return JSON.parse(JSON.stringify(tasks));
    } catch (error) {
        console.error("Failed to fetch tasks for employee", error);
        return null;
    }
}


export async function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    try {
        await connectDB();
        await TaskModel.findOneAndUpdate({ id: taskId }, { status: newStatus });
        revalidatePath('/manager/tasks');
        revalidatePath('/manager/dashboard');
        revalidatePath(`/tasks/${taskId}`);
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

export async function createTask(newTaskData: Omit<Task, '_id' | 'id' | 'comments' | 'createdBy' | 'createdAt'>) {
    try {
        await connectDB();
        const manager = await getManager();
        if (!manager) {
            throw new Error("Manager not found");
        }

        const tasksCount = await TaskModel.countDocuments();
        const newTaskId = `T${tasksCount + 1}`;
        
        const finalTaskData = {
            ...newTaskData,
            id: newTaskId,
            comments: [],
            createdBy: manager.name,
            createdAt: format(new Date(), 'yyyy-MM-dd'),
        }

        const messagesCount = await MessageModel.countDocuments();
        const newNotificationData: NotificationMessage = {
            id: `M${messagesCount + 1}`,
            type: 'notification',
            content: `created a new task "${finalTaskData.title}" and assigned it to ${finalTaskData.assignees.join(', ')}.`,
            authorId: manager.id, 
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
        revalidatePath('/manager/dashboard');
        return { success: true, task: JSON.parse(JSON.stringify(finalTaskData)) };

    } catch (error) {
        console.error("Failed to create task", error);
        return { success: false, error: 'Failed to create task' };
    }
}

export async function transferTask(taskId: string, newAssignees: string[]) {
    try {
        await connectDB();
        await TaskModel.findOneAndUpdate({ id: taskId }, { assignees: newAssignees });
        revalidatePath(`/tasks/${taskId}`);
        revalidatePath('/employee/[employeeId]/tasks', 'page');
        revalidatePath('/manager/tasks');
        return { success: true };
    } catch (error) {
        console.error("Failed to transfer task", error);
        return { success: false, error: 'Failed to transfer task' };
    }
}


export async function addCommentToTask(taskId: string, author: Employee, content: string) {
    try {
        await connectDB();
        const task = await TaskModel.findOne({ id: taskId });
        if (!task) {
            return { success: false, error: 'Task not found' };
        }

        const newComment: Comment = {
            id: `C${Date.now()}`, // Server-generated ID
            authorName: author.name,
            authorRole: author.role as any,
            content: content,
            timestamp: new Date().toISOString(),
        };

        task.comments.push(newComment);
        await task.save();

        revalidatePath(`/tasks/${taskId}`);
        return { success: true, comment: JSON.parse(JSON.stringify(newComment)) };
    } catch (error) {
        console.error("Failed to add comment", error);
        return { success: false, error: 'Failed to add comment' };
    }
}
