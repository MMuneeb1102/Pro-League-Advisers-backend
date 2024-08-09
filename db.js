import { connect } from 'mongoose';
import dotenv from 'dotenv'; // Use import for ES modules

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () =>{
    try {
        await connect(mongoURI);
        console.log('connected to database');
    } catch (error) {
        console.log(error)
    }
}

export default connectToMongo;