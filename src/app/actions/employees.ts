
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { employees } from '@/lib/data';

const addEmployeeSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  role: z.string().min(1, { message: 'Role is required.' }),
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type State = {
  errors?: {
    name?: string[];
    role?: string[];
    username?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function addEmployee(prevState: State, formData: FormData) {
  const validatedFields = addEmployeeSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to add employee. Please check the fields.',
    };
  }

  const { name, role, username, password } = validatedFields.data;

  try {
    // In a real application, you would insert this into a database.
    const newEmployee = {
      id: `E${employees.length + 1}`,
      name,
      role,
      username,
      password,
      points: 0,
      avatar: 'https://placehold.co/40x40.png',
    };
    employees.push(newEmployee);

    revalidatePath('/manager/employees');
    return { message: `Added employee ${name}.` };
  } catch (e) {
    return {
      message: 'Database Error: Failed to add employee.',
    };
  }
}
