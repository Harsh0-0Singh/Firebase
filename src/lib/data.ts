// This file is now primarily for defining TypeScript types.
// The mock data has been removed and the application now uses a MongoDB database.

export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Blocked";
export type EmployeeRole = string;
export type UserRole = 'Manager' | 'Employee' | 'Client';

export interface Comment {
    id: string;
    authorName: string;
    authorRole: UserRole;
    content: string;
    timestamp: string;
}

export interface Client {
    _id?: string;
    id: string;
    name: string;
    contactEmail: string;
    username: string;
    password?: string;
    contactNumber?: string;
    dob?: string;
}

export interface Task {
    _id?: string;
    id: string;
    title: string;
    description: string;
    assignees: string[];
    dueDate: string;
    status: TaskStatus;
    client: string;
    rating: number;
    createdBy: string;
    createdAt: string;
    comments: Comment[];
}

export interface Employee {
    _id?: string;
    id: string;
    name: string;
    role: EmployeeRole;
    avatar: string;
    points: number;
    username: string;
    password?: string;
    contactNumber?: string;
    dob?: string;
}

export interface Report {
    _id?: string;
    id: string;
    employeeId: string;
    date: string;
    content: string;
}

export interface TaskRequest {
    _id?: string;
    id: string;
    title: string;
    description: string;
    client: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ResourceRequest {
    _id?: string;
    id: string;
    requesterId: string;
    requesterName: string;
    itemName: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
    dueDate?: string;
    assignedToId?: string;
    createdAt: string;
}

export type MessageType = 'chat' | 'notification';

export interface ChatMessage {
    _id?: string;
    id: string;
    type: 'chat';
    authorId: string;
    content: string;
    timestamp: string;
}

export interface NotificationMessage {
    _id?: string;
    id: string;
    type: 'notification';
    authorId: string;
    content: string;
    timestamp: string;
    taskId?: string;
}

export type Message = ChatMessage | NotificationMessage;
