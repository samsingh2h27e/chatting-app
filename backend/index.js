import express from "express";
import cors from "cors";
import {Server} from 'socket.io';
import http from 'http';
import env from "dotenv";
import {connectDB} from './db/connectDB.js';
import authRoutes from "./routes/authRoutes.js";
import { getAllChats, getAllMessages, storeOneMessage } from "./controllers/msgControllers.js";
import { getLastSeenDateTime, setLastSeenDateTime } from "./helpers/queries.js";


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


///routes
app.use("/api/auth", authRoutes);

const activeUsers = new Map();
const lastSeenInfo = async(id)=>{
    let resp = await {_id:id, lastSeen:""};

    if (activeUsers.has(id)){ 
        resp.lastSeen = "online";
        return resp;
    }

    const date_time  = await getLastSeenDateTime(id);
    
    if (date_time.success) resp.lastSeen = date_time.data;
    return resp;
}

io.on('connection' , async(socket)=>{
    const auth = socket.handshake.auth;
    console.log(`User connected \nsocket-id : ${socket.id}, username :${auth.id} `);
    console.log('_____');
    activeUsers.set(auth.id, socket.id);
    io.emit('last-seen', await lastSeenInfo(auth.id));
 
    socket.on('message', async(data)=>{

        console.log('received data from client:\n',data);
        console.log("_____");
        const dbResponse = await storeOneMessage(data);
        // console.log(dbResponse);

        if (!dbResponse.success) {
            console.log(dbResponse.message);
            socket.emit("message", dbResponse);
            return;
        }
       
        
        if (activeUsers.has(data.receiver_id)){ 
            io.to(activeUsers.get(data.receiver_id)).emit('message',dbResponse);
            console.log("Sent message to receiver:");
            console.log("_____");
        }
       
        socket.emit('message',dbResponse);
        console.log("Sent message to sender");
        console.log("_____");
    })

    socket.on("get-initial-messages", async (peerId)=>{
        const messages = await getAllMessages(auth.id, peerId);
        socket.emit("get-initial-messages", messages);
        const lastSeenData = await lastSeenInfo(peerId)
        socket.emit('last-seen', lastSeenData);
        console.log(messages.message ,lastSeenData);
        console.log("_____");
    })

    socket.on("all-chats", async (id) =>{

        const allChats = await getAllChats(id) ;
        // console.log(allChats);
        socket.emit("all-chats", allChats);
        console.log(allChats.message);
        console.log("_____");

    })

    socket.on('disconnect', async()=>{
        console.log(`User disonnected : ${socket.id}`);
        console.log("_____");
        activeUsers.delete(auth.id);
        console.log( await setLastSeenDateTime(auth.id));
        io.emit("last-seen", await lastSeenInfo(auth.id));
    })
})


const run= async () =>{
    await connectDB();
    server.listen(PORT, ()=> {
        console.log(`Server is running on http://localhost:${PORT}`);       
    });
 }

run();
