import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    employeeCode: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true }, // e.g. Teacher, Accountant, Admin
    department: { type: String, trim: true },
    dateOfJoining: { type: Date, default: Date.now },
    salary: { type: Number, required: true, min: 0 },
    address: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('Employee', employeeSchema);
