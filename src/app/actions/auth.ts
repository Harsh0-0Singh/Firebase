
'use server';

import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import Employee from '@/models/Employee';
import Client from '@/models/Client';

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export async function login(prevState: any, formData: FormData) {
    const validatedFields = loginSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return { message: 'Invalid form data.' };
    }

    const { username, password } = validatedFields.data;

    try {
        await connectDB();
        
        let user = await Employee.findOne({ username });
        let role = 'Employee';

        if (!user) {
            user = await Client.findOne({ username });
            role = 'Client';
        }

        if (!user || user.password !== password) {
            return { message: 'Invalid username or password.' };
        }
        
        if (user.role === 'Manager') {
            role = 'Manager';
        }

        // Don't send the password back to the client
        const userObject = user.toObject();
        delete userObject.password;

        return { message: 'Login successful', user: userObject, role };

    } catch (error) {
        console.error(error);
        return { message: 'An unexpected error occurred.' };
    }
}
