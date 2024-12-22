import express from "express";
import cors from "cors";
import env from "dotenv";
import {connectDB} from './db/connectDB.js';
// import {User} from './db/userModel.js'
import authRoutes from "./routes/authRoutes.js";




env.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());
connectDB();


app.use("/api/auth", authRoutes);

app.listen(PORT, ()=>{
  
    console.log(`server running on http://localhost:${PORT}`)
});