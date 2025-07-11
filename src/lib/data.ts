export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Blocked";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  client: string;
  rating: number;
}

export interface Employee {
  id: string;
  name: string;
  role: "Manager" | "Developer" | "Designer";
  avatar: string;
  points: number;
}

export interface Report {
  id: string;
  employeeId: string;
  date: string;
  content: string;
}

export const employees: Employee[] = [
  { id: '1', name: 'Alex Doe', role: 'Manager', avatar: 'https://placehold.co/40x40.png', points: 0, },
  { id: '2', name: 'Jane Smith', role: 'Developer', avatar: 'https://placehold.co/40x40.png', points: 125, },
  { id: '3', name: 'Mike Johnson', role: 'Designer', avatar: 'https://placehold.co/40x40.png', points: 88, },
  { id: '4', name: 'Emily Brown', role: 'Developer', avatar: 'https://placehold.co/40x40.png', points: 210, },
];

export const tasks: Task[] = [
  { id: 'T1', title: 'Develop Landing Page', description: 'Create a responsive landing page for Project Alpha.', assignee: 'Jane Smith', dueDate: '2024-08-15', status: 'Completed', client: 'Innovate Corp', rating: 5 },
  { id: 'T2', title: 'Design Mobile App UI', description: 'Design the main screens for the new mobile app.', assignee: 'Mike Johnson', dueDate: '2024-08-20', status: 'In Progress', client: 'Innovate Corp', rating: 0 },
  { id: 'T3', title: 'API Integration', description: 'Integrate the new payment gateway API.', assignee: 'Emily Brown', dueDate: '2024-08-25', status: 'In Progress', client: 'Innovate Corp', rating: 0 },
  { id: 'T4', title: 'User Authentication Flow', description: 'Implement the complete user login and registration flow.', assignee: 'Jane Smith', dueDate: '2024-09-01', status: 'Pending', client: 'Tech Solutions', rating: 0 },
  { id: 'T5', title: 'Create Marketing Banners', description: 'Design a set of banners for the upcoming campaign.', assignee: 'Mike Johnson', dueDate: '2024-08-18', status: 'Completed', client: 'Tech Solutions', rating: 4 },
  { id: 'T6', title: 'Database Schema Migration', description: 'Migrate the old database schema to the new version.', assignee: 'Emily Brown', dueDate: '2024-09-05', status: 'Blocked', client: 'Innovate Corp', rating: 0 },
];

export const reports: Report[] = [
    { id: 'R1', employeeId: '2', date: '2024-08-01', content: 'Completed the initial setup for the landing page project. All base components are now in place. Ready to start on the main hero section tomorrow.' },
    { id: 'R2', employeeId: '3', date: '2024-08-01', content: 'Finalized the wireframes for the mobile app. Shared with the team for feedback. Will start working on high-fidelity mockups based on the feedback received.' },
    { id: 'R3', employeeId: '4', date: '2024-08-01', content: 'Began research on the payment gateway API documentation. Identified potential challenges with the authentication method. Will discuss with the team in the next meeting.' },
];
