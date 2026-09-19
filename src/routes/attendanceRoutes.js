import { Router } from 'express';
import {
  markBulkAttendance,
  listAttendance,
  getPersonAttendance,
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', listAttendance);
router.get('/:personType/:personId', getPersonAttendance);
router.post('/bulk', authorize('admin', 'teacher'), markBulkAttendance);

export default router;
