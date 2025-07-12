
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Task from '@/models/Task';

export async function GET() {
  await connectDB();
  try {
    const tasks = await Task.find({});
    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching tasks' }, { status: 500 });
  }
}
