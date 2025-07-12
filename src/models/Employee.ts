import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

// Hash password before saving
EmployeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
EmployeeSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
