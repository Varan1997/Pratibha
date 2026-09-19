import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    admissionNumber: { type: String, required: true, unique: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    parentName: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    admissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive', 'graduated'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);
