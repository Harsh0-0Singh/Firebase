import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String, required: true },
  points: { type: Number, default: 0 },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String },
  dob: { type: String },
});

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
