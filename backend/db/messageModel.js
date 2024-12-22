import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  message_no : {type:Number, required:true},
  prev_msg_id :{type:String, required:true},
  next_msg_id :{type:String, required:true},
});

export const Message = mongoose.model("messages", messageSchema);
