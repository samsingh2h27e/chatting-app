import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
export const connectDB = async () => {
  const uri = process.env.URI; // Replace 'testdb' with your database name

mongodb: try {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // console.log("Connected to MongoDB successfully");
} catch (error) {
  console.error("MongoDB connection error:", error);
  process.exit(1); // Exit process with failure
}
};


/// first of all "go to services and start the mongo db compass service"
