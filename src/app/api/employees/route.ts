
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Employee from '@/models/Employee';

export async function GET() {
  await connectDB();
  try {
    const employees = await Employee.find({});
    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching employees' }, { status: 500 });
  }
}
