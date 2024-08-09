import { Router } from 'express';
const router = Router();
import gameController from '../controllers/gameController.js';
const { createGame } = gameController;

router.post('/create-game/:id', createGame);

export default router;