import Tournament from '../models/Tournament.js';
import { io } from '../websocket/setup.js';

export const updateStatus = async (id) =>{
    try {
        const tournament = await Tournament.findById(id);
        if (tournament) {
            tournament.status = 'started';
            await tournament.save();
            console.log(`Tournament ${tournament._id} status updated to started.`);

            const roomId = `tournament_${tournament._id}`;

            // Emit notification to all users in the specific tournament room
            io.to(roomId).emit('tournamentStarted', {
                message: `Tournament ${tournament.name} has started!`,
                tournamentId: tournament._id,
            });

        } else {
            console.log('Tournament not found or already started.');
        }
    } catch (error) {
        console.error('Error updating tournament status:', error);
    }
}