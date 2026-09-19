import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Deliberately has no `id` claim so it cannot be used against `protect` to
// access normal routes before the OTP step completes.
export const generateOtpToken = (otpSessionId) => {
  return jwt.sign({ otpSessionId, purpose: 'otp-pending' }, process.env.JWT_SECRET, {
    expiresIn: process.env.OTP_TOKEN_EXPIRES_IN || '10m',
  });
};
