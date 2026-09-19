import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: function requiresEmail() {
        return this.role !== 'parent';
      },
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    // Parents authenticate by phone + OTP only, so they have no password.
    password: {
      type: String,
      required: function requiresPassword() {
        return this.role !== 'parent';
      },
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'teacher', 'staff', 'parent'],
      default: 'staff',
    },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    phone: { type: String, trim: true, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
