import express from "express";
import cors from "cors";
import env from "dotenv";
import {connectDB} from './db/connectDB.js';
import {User} from './db/userModel.js'



env.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());
connectDB();

// Example: Create a new user
const createUser = async () => {
  const newUser = new User({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'securepassword123',
  });

  try {
    const savedUser = await newUser.save();
    console.log('User saved:', savedUser);
  } catch (error) {
    console.error('Error saving user:', error);
  }
};




app.get('/', (req,res)=>{
  // console.log(req.body);
  // Call the function
  createUser();
  res.send("hello world");
});


app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`)
});