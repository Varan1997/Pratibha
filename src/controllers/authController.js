import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OtpSession from '../models/OtpSession.js';
import { generateToken, generateOtpToken } from '../utils/generateToken.js';
import { sendOtp, verifyOtp as verifyOtpWithProvider } from '../utils/twoFactor.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const issueOtpChallenge = async (user) => {
  const sessionId = await sendOtp(user.phone);
  const otpSession = await OtpSession.create({ user: user._id, sessionId });

  return {
    otpRequired: true,
    otpToken: generateOtpToken(otpSession._id),
    message: `An OTP was sent to the phone number ending in ${user.phone.slice(-4)}`,
  };
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    if (user.role === 'admin') {
      if (!user.phone) {
        return res.status(400).json({ message: 'No phone number is configured for this admin account' });
      }

      return res.json(await issueOtpChallenge(user));
    }

    res.json({ token: generateToken(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

// Parents have no password: they log in with just their phone number
// (the one the school recorded against their child), then verify an OTP.
export const phoneLogin = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const user = await User.findOne({ role: 'parent', phone });

    if (!user) {
      return res.status(404).json({ message: 'No parent account found for this phone number' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    res.json(await issueOtpChallenge(user));
  } catch (err) {
    next(err);
  }
};

export const verifyLoginOtp = async (req, res, next) => {
  try {
    const { otpToken, otp } = req.body;

    if (!otpToken || !otp) {
      return res.status(400).json({ message: 'otpToken and otp are required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'OTP session expired, please log in again' });
    }

    if (decoded.purpose !== 'otp-pending') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const otpSession = await OtpSession.findById(decoded.otpSessionId);
    if (!otpSession) {
      return res.status(401).json({ message: 'OTP session expired, please log in again' });
    }

    const valid = await verifyOtpWithProvider(otpSession.sessionId, otp);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    const user = await User.findById(otpSession.user);
    await OtpSession.deleteOne({ _id: otpSession._id });

    if (!user || !user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    res.json({ token: generateToken(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, employee, children, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const user = await User.create({ name, email, password, role, employee, children, phone });

    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};
