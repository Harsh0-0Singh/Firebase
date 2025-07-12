
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import Client from '@/models/Client';

const addClientSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  contactEmail: z.string().email({ message: 'Invalid email address.' }),
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
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
  const validatedFields = addClientSchema.safeParse({
    name: formData.get('name'),
    contactEmail: formData.get('contactEmail'),
    username: formData.get('username'),
    password: formData.get('password'),
  });

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
      password, // The password will be hashed by the pre-save hook in the model
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
