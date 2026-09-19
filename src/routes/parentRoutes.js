import { Router } from 'express';
import { listMyChildren, getChildAttendance } from '../controllers/parentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('parent'));

router.get('/children', listMyChildren);
router.get('/children/:childId/attendance', getChildAttendance);

export default router;
