
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import connectDB from '@/lib/mongoose';
import ResourceRequestModel from '@/models/ResourceRequest';

// Schema for creating a new request
const createRequestSchema = z.object({
  requesterId: z.string(),
  requesterName: z.string(),
  itemName: z.string().min(1, 'Item name is required.'),
  reason: z.string().min(1, 'Reason is required.'),
});

export async function createResourceRequest(data: z.infer<typeof createRequestSchema>) {
  const validatedFields = createRequestSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  try {
    await connectDB();
    const requestCount = await ResourceRequestModel.countDocuments();
    const newRequest = new ResourceRequestModel({
      ...validatedFields.data,
      id: `RES${requestCount + 1}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    });
    await newRequest.save();

    revalidatePath(`/employee/${data.requesterId}/requests`);
    return { success: true };
  } catch (error) {
    console.error('Failed to create resource request:', error);
    return { success: false, error: 'Database error: Could not create request.' };
  }
}

// Fetch requests for a specific employee
export async function getResourceRequestsForEmployee(employeeId: string) {
  try {
    await connectDB();
    const requests = await ResourceRequestModel.find({ requesterId: employeeId }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(requests));
  } catch (error) {
    console.error('Failed to fetch employee resource requests:', error);
    return [];
  }
}

// Fetch all requests for the manager
export async function getAllResourceRequests() {
  try {
    await connectDB();
    const requests = await ResourceRequestModel.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(requests));
  } catch (error) {
    console.error('Failed to fetch all resource requests:', error);
    return [];
  }
}

// Schema for updating a request (manager actions)
const updateRequestSchema = z.object({
  requestId: z.string(),
  status: z.enum(['Approved', 'Rejected', 'Completed']),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function updateResourceRequest(data: z.infer<typeof updateRequestSchema>) {
  const validatedFields = updateRequestSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid update data.' };
  }

  const { requestId, status, assigneeId, dueDate } = validatedFields.data;

  try {
    await connectDB();
    const updateData: any = { status };
    if (status === 'Approved') {
      if (!assigneeId || !dueDate) {
        return { success: false, error: 'Assignee and due date are required for approval.' };
      }
      updateData.assignedToId = assigneeId;
      updateData.dueDate = dueDate;
    }

    await ResourceRequestModel.findOneAndUpdate({ id: requestId }, updateData);

    revalidatePath('/manager/resources');
    // Also revalidate the employee's page if possible, though employeeId isn't directly available here.
    // A more advanced implementation might fetch the request to get the requesterId first.
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update resource request:', error);
    return { success: false, error: 'Database error: Could not update request.' };
  }
}
