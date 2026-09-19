import { Router } from 'express';
import {
  listClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', listClasses);
router.get('/:id', getClass);
router.post('/', authorize('admin'), createClass);
router.put('/:id', authorize('admin'), updateClass);
router.delete('/:id', authorize('admin'), deleteClass);

export default router;
