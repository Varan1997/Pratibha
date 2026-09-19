import mongoose from 'mongoose';

const otpSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

export default mongoose.model('OtpSession', otpSessionSchema);
