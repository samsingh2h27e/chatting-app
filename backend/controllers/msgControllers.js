import { User } from "../db/userModel.js";
import { Message } from "../db/messageModel.js";
import { concatenateLexicographically } from "../helpers/stringConcat.js";


export const getAllChats = async( id)=>{
    const user = await User.findById(id);

    return user.user_contacts;
    // return user;
}

export const getAllMessages= async(selfId, peerId)=>{
    const data = await User.findOne(
      { _id: selfId, "user_contacts._id": peerId }, // Match the user and contact email
      { "user_contacts.$": 1 } // Project only the matched contact
    );

    let lastMsgId =  data.user_contacts[0].chat_id;
    // console.log(data, lastMsgId);
    

    const messages = [];

    while (lastMsgId !== "null"){
        // console.log("he");
        const currMsg = await Message.findById(lastMsgId);
        messages.push(currMsg);
        lastMsgId = currMsg.prev_msg_id;
        // console.log(lastMsgId);
        
        
    }
    messages.reverse()
    return messages;
    
}

async function updateUserContactChatId(userId, contactId, newChatId) {
  try {
    const result = await User.findOneAndUpdate(
      { _id: userId, "user_contacts._id": contactId }, // Match the user and specific contact
      {
        $set: {
          "user_contacts.$.chat_id": newChatId, // Update only the chat_id
        },
      },
      { new: true } // Return the updated document
    );

    if (result) {
      console.log("Chat ID updated successfully");
    } else {
      console.log("No matching contact found.");
    }
  } catch (error) {
    console.error("Error updating chat ID:", error);
  }
}
export const storeOneMessage = async(data)=>{
    const sender_receiver_data = await User.findOne(
      { _id: data.sender_id, "user_contacts._id": data.receiver_id }, // Match the user and contact email
      { "user_contacts.$": 1 } // Project only the matched contact
    );

    let last_msg_id = sender_receiver_data.user_contacts[0].chat_id;
    let last_msg;
    if (last_msg_id ==="null"){ 
        console.log("no prev message");
        last_msg = {
            message_no:0,
            _id:"null"
        }

        console.log(last_msg);
        
    } else {
        last_msg = await Message.findById(last_msg_id);
        console.log(last_msg);
    }

   
    const new_msg = new Message({
      _id: concatenateLexicographically(data.sender_id, data.receiver_id) + (last_msg.message_no + 1),
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      message: data.message,
      message_no: (last_msg.message_no + 1),
      prev_msg_id: last_msg_id,
      next_msg_id: "null",
    });

    try {
      const message = await new_msg.save();
      console.log("message saved:", message);
    } catch (err) {
      console.error("Error saving user:", err);
    }

    
    updateUserContactChatId(data.sender_id, data.receiver_id, new_msg._id );
    updateUserContactChatId(data.receiver_id, data.sender_id, new_msg._id );


    

    return message;
    

}