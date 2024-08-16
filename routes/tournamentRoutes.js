import { Router } from 'express';
const router = Router();
import teamController from "../controllers/tournamentController.js";
const { createTournament, joinTournament, getTournamentDetails, getAllTournaments, getPlayerTournament } = teamController;
import fetchuser from '../middleware/fetchuser.js';

router.post('/create-tournament', fetchuser, createTournament)
router.post('/join-tournament/:id', fetchuser, joinTournament)
router.get('/get-tournament-details/:id', fetchuser, getTournamentDetails)
router.get('/fetch', getAllTournaments)
router.get('/mytournament', fetchuser, getPlayerTournament)

export default router;