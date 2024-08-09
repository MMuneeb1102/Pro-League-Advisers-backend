import { Router } from 'express';
const router = Router();
import createCategory  from '../controllers/categoryController.js';

router.post('/create-category', createCategory);

export default router;