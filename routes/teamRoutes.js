import { Router } from 'express';
const router = Router();
import fetchuser from '../middleware/fetchuser.js';
import teamController from "../controllers/teamController.js";
const { createTeam } = teamController;

router.post('/create-team/:id', fetchuser, createTeam);

export default router;