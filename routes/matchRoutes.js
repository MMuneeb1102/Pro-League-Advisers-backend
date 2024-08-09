import { Router } from 'express';
const router = Router();
import matchController from '../controllers/matchController.js';
import fetchuser from '../middleware/fetchuser.js';
const { updateMatchScore } = matchController;

router.post('/updateScore', fetchuser, updateMatchScore);

export default router;