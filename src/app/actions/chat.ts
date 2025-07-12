
'use server';

import EmployeeModel from '@/models/Employee';
import MessageModel from '@/models/Message';
import type { Employee, Message } from '@/lib/data';

export async function getChatData(): Promise<{ messages: Message[], employees: Employee[] }> {
    try {
        const messagesData = await MessageModel.find({}).sort({ timestamp: 'asc' }).lean();
        const employeesData = await EmployeeModel.find({}).lean();

        return {
            messages: JSON.parse(JSON.stringify(messagesData)),
            employees: JSON.parse(JSON.stringify(employeesData)),
        };
    } catch (error) {
        console.error("Failed to fetch chat data", error);
        return { messages: [], employees: [] };
    }
}

export async function postChatMessage(chatMessage: Omit<Message, '_id' | 'id'> & { id: string }) {
    try {
        const messageDoc = new MessageModel(chatMessage);
        await messageDoc.save();
    } catch (error) {
        console.error("Failed to save message", error);
        // In a real app, you might want to throw the error to handle it on the client
        return { success: false, error: 'Failed to save message' };
    }
    return { success: true };
}
