
'use server';

import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import Employee from '@/models/Employee';
import Client from '@/models/Client';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

// This is a temporary function to fix a user's password if it was hashed.
// It will be removed after the user logs in successfully once.
async function repairAndLogin(user: any, passwordAttempt: string) {
    const isHashed = user.password.startsWith('$2a$');
    
    // If password is not hashed, do a simple compare.
    if (!isHashed) {
        if (user.password === passwordAttempt) {
            return user;
        }
        return null;
    }

    // If password is hashed, check if the attempt matches.
    const isMatch = await bcrypt.compare(passwordAttempt, user.password);
    if (isMatch) {
        // The password was correct. "Fix" it by saving the plaintext version back.
        // This is a one-time operation.
        user.password = passwordAttempt;
        await user.save();
        return user;
    }
    
    return null;
}


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
        
        let userDoc = await Employee.findOne({ username });
        let role = 'Employee';

        if (!userDoc) {
            userDoc = await Client.findOne({ username });
            role = 'Client';
        }

        if (!userDoc) {
            return { message: 'Invalid username or password.' };
        }

        // START TEMPORARY FIX
        let successfulUser = null;
        if (userDoc.role === 'Manager') {
             // Attempt to repair the manager password if needed.
             successfulUser = await repairAndLogin(userDoc, password);
        } else {
             // For other users, do a simple check.
            if (userDoc.password === password) {
                successfulUser = userDoc;
            }
        }

        if (!successfulUser) {
             return { message: 'Invalid username or password.' };
        }
        // END TEMPORARY FIX
        
        if (userDoc.role === 'Manager') {
            role = 'Manager';
        }

        // Don't send the password back to the client
        const userObject = successfulUser.toObject();
        delete userObject.password;

        return { message: 'Login successful', user: userObject, role };

    } catch (error) {
        console.error(error);
        return { message: 'An unexpected error occurred.' };
    }
}
