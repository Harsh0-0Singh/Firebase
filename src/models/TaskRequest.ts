
import mongoose from 'mongoose';

const TaskRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: String, required: true },
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});

export default mongoose.models.TaskRequest || mongoose.model('TaskRequest', TaskRequestSchema);
