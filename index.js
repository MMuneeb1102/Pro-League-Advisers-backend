import connectToMongo from './db.js';
import express, { json } from 'express';
// import path from 'path';
import cors from 'cors';
import playerRoutes from './routes/playerRoutes.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import { httpServer } from './websocket/setup.js';
// import { createServer } from "http";
// import { Server } from "socket.io";
import  { app } from './websocket/setup.js'

await connectToMongo();
// const app = express();
const port = 5000;

// const httpServer = createServer(app);
// const io = new Server(httpServer);



app.use(cors({
    origin: 'http://localhost:5173',
    method: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true,
  }));

app.use(json());

app.use('/api/auth', playerRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/match', matchRoutes);

app.use('/api/tournament', tournamentRoutes);
app.use('/api/admin/category', categoryRoutes);
app.use('/api/admin/game', gameRoutes);


httpServer.listen(port, () =>{
    console.log(`Pro League Advisers running on ${port}`)
    console.log(new Date())
})