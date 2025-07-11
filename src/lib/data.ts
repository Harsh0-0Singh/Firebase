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
    id: string;
    name: string;
    contactEmail: string;
    username: string;
    password?: string;
    contactNumber?: string;
    dob?: string;
}

export interface Task {
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
  id: string;
  employeeId: string;
  date: string;
  content: string;
}

export interface TaskRequest {
    id: string;
    title: string;
    description: string;
    client: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}


export const clients: Client[] = [
    { id: '1', name: 'Innovate Corp', contactEmail: 'contact@innovate.com', username: 'client1', password: 'password', contactNumber: '123-456-7890', dob: '1990-01-01' },
    { id: '2', name: 'Tech Solutions', contactEmail: 'hello@techsolutions.io', username: 'client2', password: 'password', contactNumber: '098-765-4321', dob: '1985-05-15' },
];

export const employees: Employee[] = [
  { id: '1', name: 'Alex Doe', role: 'Manager', avatar: 'https://placehold.co/40x40.png', points: 0, username: 'manager', password: 'password' },
  { id: '2', name: 'Jane Smith', role: 'Developer', avatar: 'https://placehold.co/40x40.png', points: 125, username: 'jane', password: 'password', contactNumber: '555-1234', dob: '1992-08-20' },
  { id: '3', name: 'Mike Johnson', role: 'Designer', avatar: 'https://placehold.co/40x40.png', points: 88, username: 'mike', password: 'password', contactNumber: '555-5678', dob: '1988-11-30' },
  { id: '4', name: 'Emily Brown', role: 'Developer', avatar: 'https://placehold.co/40x40.png', points: 210, username: 'emily', password: 'password', contactNumber: '555-9012', dob: '1995-03-12' },
];

export const tasks: Task[] = [
  { id: 'T1', title: 'Develop Landing Page', description: 'Create a responsive landing page for Project Alpha.', assignees: ['Jane Smith'], dueDate: '2024-08-15', status: 'Completed', client: 'Innovate Corp', rating: 5, createdBy: 'Alex Doe', createdAt: '2024-07-20T10:00:00Z', comments: [
      { id: 'C1', authorName: 'Alex Doe', authorRole: 'Manager', content: 'Great start! Let\'s aim to get the hero section done by EOD Wednesday.', timestamp: '2024-07-21T11:30:00Z' },
      { id: 'C2', authorName: 'Jane Smith', authorRole: 'Employee', content: 'Sounds good. I\'ve pushed the initial commit.', timestamp: '2024-07-22T15:00:00Z' }
  ]},
  { id: 'T2', title: 'Design Mobile App UI', description: 'Design the main screens for the new mobile app.', assignees: ['Mike Johnson'], dueDate: '2024-08-20', status: 'In Progress', client: 'Innovate Corp', rating: 0, createdBy: 'Alex Doe', createdAt: '2024-07-25T10:00:00Z', comments: [] },
  { id: 'T3', title: 'API Integration', description: 'Integrate the new payment gateway API.', assignees: ['Emily Brown', 'Jane Smith'], dueDate: '2024-08-25', status: 'In Progress', client: 'Innovate Corp', rating: 0, createdBy: 'Alex Doe', createdAt: '2024-08-01T10:00:00Z', comments: [] },
  { id: 'T4', title: 'User Authentication Flow', description: 'Implement the complete user login and registration flow.', assignees: ['Jane Smith'], dueDate: '2024-09-01', status: 'Pending', client: 'Tech Solutions', rating: 0, createdBy: 'Alex Doe', createdAt: '2024-08-05T10:00:00Z', comments: [] },
  { id: 'T5', title: 'Create Marketing Banners', description: 'Design a set of banners for the upcoming campaign.', assignees: ['Mike Johnson'], dueDate: '2024-08-18', status: 'Completed', client: 'Tech Solutions', rating: 4, createdBy: 'Alex Doe', createdAt: '2024-08-10T10:00:00Z', comments: [] },
  { id: 'T6', title: 'Database Schema Migration', description: 'Migrate the old database schema to the new version.', assignees: ['Emily Brown'], dueDate: '2024-09-05', status: 'Blocked', client: 'Innovate Corp', rating: 0, createdBy: 'Alex Doe', createdAt: '2024-08-12T10:00:00Z', comments: [] },
];

export const reports: Report[] = [
    { id: 'R1', employeeId: '2', date: '2024-08-01', content: 'Completed the initial setup for the landing page project. All base components are now in place. Ready to start on the main hero section tomorrow.' },
    { id: 'R2', employeeId: '3', date: '2024-08-01', content: 'Finalized the wireframes for the mobile app. Shared with the team for feedback. Will start working on high-fidelity mockups based on the feedback received.' },
    { id: 'R3', employeeId: '4', date: '2024-08-01', content: 'Began research on the payment gateway API documentation. Identified potential challenges with the authentication method. Will discuss with the team in the next meeting.' },
];

export const taskRequests: TaskRequest[] = [
    { id: 'REQ1', title: 'Add Dark Mode to Client Portal', description: 'Our team would love to have a dark mode option in the portal for better viewing at night.', client: 'Innovate Corp', status: 'Pending' },
    { id: 'REQ2', title: 'Export Data as CSV', description: 'We need a feature to export the task list as a CSV file for our internal records.', client: 'Tech Solutions', status: 'Pending' },
    { id: 'REQ3', title: 'Update Company Logo', description: 'We have rebranded and need to update our logo across the platform.', client: 'Innovate Corp', status: 'Pending' },
];
