import express from "express";
import cors from "cors";
import {Server} from 'socket.io';
import http from 'http';
import env from "dotenv";
import {connectDB} from './db/connectDB.js';
import authRoutes from "./routes/authRoutes.js";




env.config();
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors :{
        origin : 'http://localhost:3000',
        methods:['GET', 'POST']
    }
});

app.use(express.json());
app.use(cors());
connectDB();

///routes
app.use("/api/auth", authRoutes);


io.on('connection' , (socket)=>{
    console.log(`User connected : ${socket.id}`);

    socket.on('message', (data)=>{
        console.log(`sending ${data} to ${socket.id}`);
        socket.emit('message', data);
    })


    socket.on('disconnect', ()=>{
        console.log(`User disonnected : ${socket.id}`);
    })
})

// app.listen(PORT, ()=>{
  
//     console.log(`server running on http://localhost:${PORT}`)
// });

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});