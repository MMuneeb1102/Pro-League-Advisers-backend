import Tournament from '../models/Tournament.js';

export const updateStatus = async (id) =>{
    try {
        const tournament = await Tournament.findById(id);
        if (tournament) {
            tournament.status = 'started';
            await tournament.save();
            console.log(`Tournament ${tournament._id} status updated to started.`);
        } else {
            console.log('Tournament not found or already started.');
        }
    } catch (error) {
        console.error('Error updating tournament status:', error);
    }
}