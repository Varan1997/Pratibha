import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    personType: { type: String, enum: ['Student', 'Employee'], required: true },
    person: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'personType',
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'leave', 'half-day'],
      required: true,
    },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String, trim: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ date: 1, personType: 1, person: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
