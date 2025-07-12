
'use server';

import connectDB from '@/lib/mongoose';
import Client from '@/models/Client';

export async function addClient(prevState: any, formData: FormData) {
  // Add client logic was removed when reverting hashing.
  return {
    message: "Add client functionality is currently disabled.",
  };
}

export async function getClients() {
    try {
        await connectDB();
        const clients = await Client.find({}).lean();
        return JSON.parse(JSON.stringify(clients));
    } catch (error) {
        console.error("Failed to fetch clients", error);
        return [];
    }
}

export type State = {
  errors?: {
    name?: string[];
    contactEmail?: string[];
    username?: string[];
    password?: string[];
  };
  message?: string | null;
};
