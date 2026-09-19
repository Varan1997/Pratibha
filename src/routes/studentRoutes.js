import { Router } from 'express';
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', listStudents);
router.get('/:id', getStudent);
router.post('/', authorize('admin', 'teacher'), createStudent);
router.put('/:id', authorize('admin', 'teacher'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

export default router;
