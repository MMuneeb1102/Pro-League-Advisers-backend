import Tournament from '../models/Tournament.js';
import Player from '../models/Player.js';
import Match from '../models/Match.js';
import matchController from '../controllers/matchController.js';
const { findOpponentForMatch, createMatch } = matchController;
import schedule from 'node-schedule';
import { updateStatus } from '../jobs/TournamentSchedule.js';

const createTournament = async (req, res) =>{
    try{
        const { user } = req;

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const {tournamentName, description, platform, startDate, endDate, tournamentType, requiredContenders, game } = req.body;

        const newTour = await Tournament.create({
            tournamentName: tournamentName,
            tournamentType: tournamentType,
            requiredContenders: requiredContenders,
            description: description,
            platform: platform,
            startDate: startDate,
            endDate: endDate,
            joining: true,
            game: game
          });

          for (let i = 0; i < newTour.requiredContenders - 1; i++) {
            let roundType;
        
            if (newTour.requiredContenders === 8) {
                if (i < 4) {
                    roundType = 'round8';
                } else if (i >= 4 && i < 6) {
                    roundType = 'semi-final';
                } 
                else if(i === 6){
                    roundType = 'final'
                }
                
                const createdMatch = await Match.create({ 
                    tournament: newTour._id,
                    round: roundType
                });
                
                await Tournament.findOneAndUpdate(
                    newTour._id,
                    { $push: { matches: createdMatch._id } },
                    { new: true, useFindAndModify: false }
                );
            }
        }
          schedule.scheduleJob(startDate, () => updateStatus(newTour._id));
          res.status(201).json({success: true, message: "Tournament created successfully!!"});
          
        } catch(error){
            res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
}

// const joinTournament = async (req, res) => {
//     try {
//         const { user } = req;

//         if (!user) {
//             return res.status(401).json({ success: false, message: 'User not authenticated' });
//         }

//         const tournamentId = req.params.id;

//         // Find the player and the tournament
//         const player = await Player.findById(user.id);
//         const tournament = await Tournament.findById(tournamentId);

//         const isPlayerInAnyTournament = await Tournament.findOne({ participants: user.id });

//         if (!player) {
//             return res.status(404).send('Player not found');
//         }
        
//         if (!tournament) {
//             return res.status(404).send('Tournament not found');
//         }

//         if (isPlayerInAnyTournament) {
//             return res.status(400).send('Player is already participating in a tournament');
//         }

//         // Check if the tournament is solo type and open for joining
//         if (tournament.tournamentType !== 'solo') {
//             return res.status(400).send('This tournament is not a solo tournament');
//         }

//         if (!tournament.joining) {
//             return res.status(400).send('This tournament is not open for joining');
//         }
        
//         if(tournament.participants.length >= 6){
//             console.log("Tournament is full");
//             return res.status(400).send('Tournament is full');
//         }
//         // Add player to the participants list if not already added
//         if (!tournament.participants.includes(user.id)) {
//             tournament.participants.push(user.id);
//             await tournament.save();

//             const opponentId = await findOpponentForMatch(tournamentId, user.id);
//             if (opponentId) {
//                 // Create a new match
//                 const match = await createMatch(tournamentId, user.id, opponentId);
//             if (match) {
//                 return res.send({ message: 'Match created', match });
//             } else {
//                 return res.status(500).send('Error creating match');
//             }
//             }

//             return res.status(200).send({ message: 'Player joined tournament, waiting for opponent' });

//         } else {
//             return res.status(400).send('Player already in the tournament');
//         }
//     } catch (error) {
//         return res.status(500).send(error.message);
//     }
// }

const joinTournament = async (req, res) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const { platform, platformUsername } = req.body;

        const tournamentId = req.params.id;

        // Find the player and the tournament
        const player = await Player.findById(user.id);
        const tournament = await Tournament.findById(tournamentId);

        const isPlayerInAnyTournament = await Tournament.findOne({ 'participants.player': user.id });

        if (!player) {
            return res.status(404).send('Player not found');
        }
        
        if (!tournament) {
            return res.status(404).send('Tournament not found');
        }
        
        if (!tournament.joining) {
            return res.status(400).send('This tournament is not open for joining');
        }

        if (isPlayerInAnyTournament) {
            return res.status(400).send('Player is already participating in a tournament');
        }
        
        if(tournament.participants.length >= tournament.requiredContenders){
            console.log("Tournament is full");
            return res.status(400).send('Tournament is full');
        }

        // Check if the tournament is solo type and open for joining
        if (tournament.tournamentType === 'solo') {
            tournament.participants.push({ player: user.id, platform: platform, platformUsername: platformUsername});
            await tournament.save();

            const availableMatch = await Match.findOne({
                tournament: tournamentId,
                $or: [
                    { 'player1.id': { $exists: false } },
                    { 'player2.id': { $exists: false } }
                ]
            });
    
            if (availableMatch) {
                if (!availableMatch.player1.id) {
                    availableMatch.player1.id = user.id;
                    availableMatch.player1.platform = platform;
                    availableMatch.player1.platformUsername = platformUsername;
                    availableMatch.matchStatus = 'waiting'; // Match can start when both players are assigned
                } else if (!availableMatch.player2.id) {
                    availableMatch.player2.id = user.id;
                    availableMatch.player2.platform = platform;
                    availableMatch.player2.platformUsername = platformUsername;
                }
                await availableMatch.save();
            }
            return res.status(200).send({success: true, message: 'Player joined tournament' });
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function getTournamentDetails(req, res) {
    try {
        const tournamentId = req.params.id;
        const tournament = await Tournament.findById(tournamentId)
            .populate('participants')
            .populate('teams')
            .populate({
                path: 'matches',
                populate: { path: 'player1 player2', select: 'userName' } // populate player details in matches
            });

        if (!tournament) {
            return res.status(404).send('Tournament not found');
        }

        res.status(200).json(tournament);
    } catch (error) {
        console.error('Error getting tournament details:', error);
        res.status(500).send('Server error');
    }
}

const getAllTournaments = async (req, res) =>{
    try {
        const tournaments = await Tournament.find();
        res.status(200).json(tournaments)

    } catch (error) {
        res.status(500).send('Server error');
    }
}

const getPlayerTournament = async (req, res) =>{
    try {
        const {user} = req;

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        
        const tournament = await Tournament.findOne({ 'participants.player': user.id });
        res.status(200).json(tournament)

    } catch (error) {
        res.status(500).send('Server error');
    }
}

export default { createTournament, joinTournament, getTournamentDetails, getAllTournaments, getPlayerTournament };