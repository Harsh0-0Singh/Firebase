import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: String, required: true },
});

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignees: [{ type: String }],
  dueDate: { type: String, required: true },
  status: { type: String, required: true, enum: ["Pending", "In Progress", "Completed", "Blocked"] },
  client: { type: String, required: true },
  rating: { type: Number, default: 0 },
  createdBy: { type: String, required: true },
  createdAt: { type: String, required: true },
  comments: [CommentSchema],
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
