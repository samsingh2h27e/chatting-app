import mongoose from "mongoose";

// Define the subdocument schema for user contacts
const userContactSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true },
  username: { type: String, required: true },
  chat_id: { type: String, required: true },
});
// 
// Define the main user schema
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Custom _id as a string
  username: { type: String, required: true },
  password: { type: String, required: true },
  user_contacts: [userContactSchema],
});

// Create and export the model
export const User = mongoose.model("users", userSchema);
