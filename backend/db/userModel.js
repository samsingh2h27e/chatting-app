import mongoose from "mongoose";

// Define the subdocument schema for user contacts
const userContactSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true },
  username: { type: String, required: true },
  chat_id: { type: String, required: true },
  unread_messages :{type:Number, required:true, default:0}
});
//
// Define the main user schema
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Custom _id as a string
  username: { type: String, required: true },
  password: { type: String, required: true },
  user_contacts: [userContactSchema],
  last_seen_date_time: {
    type: Date,
    default: Date.now,
    required: true,
    // Stores current date and time by default
  },
});

// Create and export the model
const User = mongoose.model("users", userSchema);

export {User};
