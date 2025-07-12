
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['chat', 'notification'] },
  authorId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: String, required: true },
  taskId: { type: String }, // Optional, only for notifications
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
