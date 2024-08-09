import { Schema, model } from 'mongoose';

 const teamSchema = new Schema({
    teamName: {
        type: String,
        required: true
    },

    leader: {
        type: Schema.Types.ObjectId,
        ref: 'player',
        required: true
    },

    members: [{
        type: Schema.Types.ObjectId,
        ref: 'player'
    }],

    date: {
        type: Date,
        default: Date.now
    }
 })

 const Team = model('team', teamSchema);

 export default Team;