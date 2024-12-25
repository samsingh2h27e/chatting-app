import express from "express";
import cors from "cors";
import {Server} from 'socket.io';
import http from 'http';
import env from "dotenv";
import {connectDB} from './db/connectDB.js';
import authRoutes from "./routes/authRoutes.js";
import { getAllChats } from "./controllers/msgControllers.js";




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
    const auth = socket.handshake.auth;
    console.log(`User connected : ${socket.id}`);
    

    socket.on('message', (data)=>{
        console.log(`sending ${data} to ${socket.id}`);
        socket.emit('message', data);
    })

    socket.on("all-chats", async (id) =>{

        const allChats = await getAllChats(id) ;
        console.log(socket.id);
        console.log(allChats);
        // io.to(socket.id).emit("all-chats", allChats ); /// this also works but better for sending to other connection
        socket.emit("all-chats", allChats )

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