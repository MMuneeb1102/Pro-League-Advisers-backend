import { Schema, model } from 'mongoose';

const tournamentSchema = new Schema({
    tournamentName: {
        type: String,
        required: true
    },

    requiredContenders:{
        type: Number,
        enum: [8, 16, 32]
    },

    game: {
        type: Schema.Types.ObjectId, 
        ref: "game"
    },

    tournamentType: {
        type: String,
        enum: ['solo', 'team']
    },

    description: {
        type: String
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'team',
        required: true
    }],

    participants: [{
        player: {
            type: Schema.Types.ObjectId,
            ref: 'player'
        },

        platform: {
            type: String
        },

        platformUsername: {
            type: String
        },

        winningStatus: {
            type: String,
            enum: ['win', 'lose', 'inProgress'],
            default: 'inProgress'
        }
    }],

    matches: [{
        type: Schema.Types.ObjectId,
        ref: 'match'
    }],

    winner: {
        type: Schema.Types.ObjectId,
        ref: 'team'
    },

    status: {
        type: String,
        enum: ['started', 'ended']
    },

    joining: {
        type: Boolean,
    }
 })

 const Tournament = model('tournament', tournamentSchema);
 export default Tournament;