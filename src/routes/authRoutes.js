import { Router } from 'express';
import { login, phoneLogin, verifyLoginOtp, register, me } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/phone-login', phoneLogin);
router.post('/verify-otp', verifyLoginOtp);
router.get('/me', protect, me);
router.post('/register', protect, authorize('admin'), register);

export default router;
