import express from 'express';
import cors from 'cors';
import pg from "pg";
import axios from "axios";
import env from "dotenv";
import bcrypt from "bcrypt";

const saltRounds = 8;

env.config();
const db = new pg.Client({
    user : process.env.USER,
    host : "localhost",
    database : process.env.DATABASE,
    password : process.env.PASSWORD,
    port : 5432
});

db.connect();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/register',(req,res)=>{
    res.send(req.body);
    let user = req.body;

    bcrypt.hash(user.password,saltRounds,async (err,hash)=>{
        db.query("INSERT INTO users (email,name,surname,age,password) VALUES ($1,$2,$3,$4,$5)",
        [user.email,user.fname,user.lname,user.age,hash]);
    });
});

app.post('/login', async (req, res) => {
    let user = req.body;
    const table = await db.query("SELECT * FROM users WHERE email = $1 AND password = $2",[user.email,user.password]);
    if(table.rows){
        bcrypt.compare(table.rows[0].password,user.password,async (err,result)=>{
            if(err){
                console.error(err.message);
            }
            else{
                if(result){

                }
                else{
                    alert("Incorrect password");
                }
            }
        })
    }
    else{
        alert("Email or Password doesn't match!");
    }
});


app.listen(5000,()=>{
    console.log("server running on port 5000");
});

