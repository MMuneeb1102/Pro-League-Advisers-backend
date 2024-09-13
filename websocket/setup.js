import { createServer } from "http";
import { Server } from "socket.io";
import express, {json} from 'express';

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173', // Replace with your frontend URL
        methods: ["GET", "POST"],
        credentials: true, // If you are using cookies or authentication
    }
});

app.use(json());

io.on("connection", (socket) => {
    console.log('A user connected', socket.id);
 
     socket.on('joinTournament', (tournamentId) => {
         const roomId = `tournament_${tournamentId}`;
         socket.join(roomId);
         console.log(`User ${socket.id} joined room ${roomId}`);
     });
 
     socket.on('disconnect', () => {
         console.log('A user disconnected');
     });
 });

 export { io, httpServer, app }