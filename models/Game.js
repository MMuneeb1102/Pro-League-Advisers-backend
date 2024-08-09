import { Schema, model } from 'mongoose';

const gameSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },

    description: { 
        type: String
    },

    category: { 
        type: Schema.Types.ObjectId, 
        ref: "category"
    }
});

const Game = model("game", gameSchema);

export default Game;
