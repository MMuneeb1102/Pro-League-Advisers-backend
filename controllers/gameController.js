import Game from '../models/Game.js';

const createGame = async (req, res) =>{
    try{
        const catId = req.params.id;
        const existingGame = await Game.findOne({title: req.body.title});
        if(existingGame){
            return res.status(401).json({success: false, message: "Game is already in the list"});
        }

        await Game.create({
        title: req.body.title,
        category: catId
        });

        res.status(201).json({success: true, message: "Game created successfully!!"});
    } catch(error){
        res.status(400).json({success: false, message: "error while creating game"});
    }
}

export default { createGame };