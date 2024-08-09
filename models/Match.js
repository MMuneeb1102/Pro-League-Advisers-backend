import { Schema, model } from 'mongoose';

const matchSchema = new Schema({
    tournament: { 
        type: Schema.Types.ObjectId, 
        ref: 'tournament' 
    },

    round: {
        type: String,
        enum: ['round8', 'semi-final', 'final']
    },

    team1: {
        id: {
            type: Schema.Types.ObjectId, 
            ref: 'team' 
        },
        score: {
            type: Number,
            required: true,
            default: 0
        } 
    },

    team2: {
        id: {
            type: Schema.Types.ObjectId, 
            ref: 'team' 
        },
        score: {
            type: Number,
            required: true,
            default: 0
        } 
    },

    player1: {
        id: {
            type: Schema.Types.ObjectId, 
            ref: 'player' 
        },

        platform: {
            type: String
        },

        platformUsername: {
            type: String
        },

        score: {
            type: Number,
            required: true,
            default: 0
        } 
    },

    player2: {
        id: {
            type: Schema.Types.ObjectId, 
            ref: 'player' 
        },

        platform: {
            type: String
        },

        platformUsername: {
            type: String
        },

        score: {
            type: Number,
            required: true,
            default: 0
        } 
    },

    matchDate: { 
        type: Date, 
        default: Date.now
    },

    matchStatus: {
        type: String,
        enum: ['started', 'ended', 'created', 'waiting'],
        default: 'created'
    },

    winningTeam: {
        type: Schema.Types.ObjectId, 
        ref: 'team' 
    },

    playerWinner: {
        type: Schema.Types.ObjectId, 
        ref: 'player' 
    }
});

const Match = model("match", matchSchema);

export default Match;
