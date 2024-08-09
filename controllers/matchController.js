import Match from '../models/Match.js';
import Tournament from '../models/Tournament.js';

const findOpponentForMatch = async (tournamentId, playerId) => {
    try {
        const tournament = await Tournament.findById(tournamentId);
        const tournamentParticipants = tournament.participants.map(participant => participant.toString());

        const participants = tournamentParticipants.filter(participant => participant !== playerId);
        const opponentIds = [];

        for (const participantId of participants) {
            const isInMatch = await Match.exists({
                $or: [
                    { 'player1.id': participantId },
                    { 'player2.id': participantId }
                ]
            });

            if (!isInMatch) {
                opponentIds.push(participantId);
            }
        }

        if (opponentIds.length > 0) {
            // Return a random opponent for simplicity
            return opponentIds[Math.floor(Math.random() * opponentIds.length)];
        }
        return null; // No opponent available
    } catch (err) {
        console.error(err);
        return null;
    }
}


  
  const createMatch = async ( tournamentId, player1Id, player2Id) => {
    try {
        const match = new Match({ 
          tournament: tournamentId, 
          player1: { id: player1Id },
          player2: { id: player2Id }
        });
        await match.save();
        return match;
      } catch (err) {
        console.error(err);
        return null;
      }
  }


const updateMatchScore = async (req, res) => {
    try{
        const { user } = req;

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const { matchId, score } = req.body;
        const match = await Match.findById(matchId);

        if (!match) {
            return res.status(404).send('Match not found');
        }

        match.score = score;
        await match.save();
        res.status(200).send('Score updated');
        
    } catch (error){
        console.error('Error updating scores:', error);
    }
    
}

export default {
    updateMatchScore,
    findOpponentForMatch,
    createMatch
};
