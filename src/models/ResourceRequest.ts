
import mongoose from 'mongoose';

const ResourceRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  requesterId: { type: String, required: true },
  requesterName: { type: String, required: true },
  itemName: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
  createdAt: { type: String, required: true },
  dueDate: { type: String },
  assignedToId: { type: String },
});

export default mongoose.models.ResourceRequest || mongoose.model('ResourceRequest', ResourceRequestSchema);
