
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import Employee from '@/models/Employee';

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
    await connectDB();
    
    const existingEmployee = await Employee.findOne({ username });
    if (existingEmployee) {
        return { message: "Username already exists." };
    }
    
    const employeesCount = await Employee.countDocuments();
    
    const newEmployee = new Employee({
      id: `E${employeesCount + 1}`,
      name,
      role,
      username,
      password,
      points: 0,
      avatar: 'https://placehold.co/40x40.png',
    });
    
    await newEmployee.save();

    revalidatePath('/manager/employees');
    return { message: `Added employee ${name}.` };
  } catch (e) {
    console.error(e);
    return {
      message: 'Database Error: Failed to add employee.',
    };
  }
}
