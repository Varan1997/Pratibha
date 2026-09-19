import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Grade 5"
    section: { type: String, required: true, trim: true }, // e.g. "A"
    academicYear: { type: String, required: true, trim: true }, // e.g. "2026-2027"
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  },
  { timestamps: true }
);

classSchema.index({ name: 1, section: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('Class', classSchema);
