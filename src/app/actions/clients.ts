
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import Client from '@/models/Client';

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

const addClientSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  contactEmail: z.string().email({ message: 'Please enter a valid email.' }),
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});


export type State = {
  errors?: {
    name?: string[];
    contactEmail?: string[];
    username?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function addClient(prevState: State, formData: FormData) {
  const validatedFields = addClientSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to add client. Please check the fields.',
    };
  }

  const { name, contactEmail, username, password } = validatedFields.data;

  try {
    await connectDB();
    
    const existingClient = await Client.findOne({ username });
    if (existingClient) {
        return { message: "Username already exists." };
    }
    
    const clientsCount = await Client.countDocuments();
    
    const newClient = new Client({
      id: `C${clientsCount + 1}`,
      name,
      contactEmail,
      username,
      password,
    });
    
    await newClient.save();

    revalidatePath('/manager/clients');
    return { message: `Added client ${name}.` };
  } catch (e) {
    console.error(e);
    return {
      message: 'Database Error: Failed to add client.',
    };
  }
}
