import { Schema, model } from 'mongoose';

const playerSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    teamName: {
        type: String,
        default: null
    },

    date: {
        type: Date,
        default: Date.now
    }
})

const Player = model('player', playerSchema)
export default Player;