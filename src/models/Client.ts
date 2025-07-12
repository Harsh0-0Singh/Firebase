import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  contactEmail: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String },
  dob: { type: String },
});

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);
