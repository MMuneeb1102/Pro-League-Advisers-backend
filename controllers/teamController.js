import Team from '../models/Team.js';
import Player from '../models/Player.js';

const createTeam = async (req, res) =>{
    try{

        const { user } = req;

        if(!user){
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const { teamName } = req.body;
        console.log(teamName)

        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({ success: false, message: 'Player not found' });
        }

        if(player.teamName !== null){
            return res.status(400).json({success: false, message: "You are already in a team!"})
        }
        const team = new Team({
            teamName: teamName,
            leader: player._id
        })

        await team.save();

        await Player.findOneAndUpdate(
            { _id: player._id },
            { $set: { teamName: teamName } }
        );

        res.status(201).json({success: true, message: "team created successfully"});

    } catch(error){
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
}

export default { createTeam }