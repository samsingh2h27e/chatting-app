import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = "mongodb://127.0.0.1:27017/chat-app-test"; // Replace 'testdb' with your database name

mongodb: try {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB successfully");
} catch (error) {
  console.error("MongoDB connection error:", error);
  process.exit(1); // Exit process with failure
}
};


/// first of all "go to services and start the mongo db compass service"
