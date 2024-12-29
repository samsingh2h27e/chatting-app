import { User } from "../db/userModel.js";
import { Message } from "../db/messageModel.js";
import { concatenateLexicographically } from "../helpers/stringConcat.js";
import { updateUserContactChatId } from "../helpers/queries.js";


export const getAllChats = async( id)=>{
    let user, resp;
    try {
      user = await User.findById(id);
      resp = {success:true, data:user.user_contacts, message : 'sent all-chats'}
    } catch (err) {
      console.log("error while fetching user at getAllChats()")
      resp = { success:false, data:null, message:'not able to send all-chats'};
    }

    return resp;
   
}

export const getAllMessages= async(selfId, peerId)=>{
    let data, resp; 
    try {
      data = await User.findOne(
        { _id: selfId, "user_contacts._id": peerId }, // Match the user and contact email
        { "user_contacts.$": 1 } // Project only the matched contact
      );
      
    } catch (error) {
      resp = {success:false, data:[], message:"error while finding user's user_contacts"}
      return resp;
    }

    let lastMsgId =  data.user_contacts[0].chat_id;
    
    const messages = [];

    while (lastMsgId !== "null" && lastMsgId !== null){
        
        let currMsg;

        try {
          currMsg = await Message.findById(lastMsgId);
        } catch (error) {
          resp={success:false, data:[], message:"error while collecting chat's messages"}
          return resp;
        }

        messages.push(currMsg);
        lastMsgId = currMsg.prev_msg_id;
 
    }
    messages.reverse()

    resp = {success:true, data:messages, message:"sent all-messages"}
    return resp;
    
}


export const storeOneMessage = async(data)=>{
    let sender_receiver_data ,resp ;

    try {
      sender_receiver_data = await User.findOne(
      { _id: data.sender_id, "user_contacts._id": data.receiver_id }, // Match the user and contact email
      { "user_contacts.$": 1 } // Project only the matched contact
    );
      
    } catch (error) {
      resp = {success:false, data:[], message : "failed while getting last-message-id"}
      return resp;
    }

    let last_msg_id = sender_receiver_data.user_contacts[0].chat_id;
    let last_msg;
    if (last_msg_id ==="null"){ 
        console.log("no prev message");
        last_msg = {
            message_no:0,
            _id:"null"
        }
   
    }else {
      try {
        last_msg = await Message.findById(last_msg_id);
      } catch (error) {
        resp = {success:false, data:[], message:"error while getting the last-message using its _id"}
        return resp;
      } 
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

    let message;

    try {
      message = await new_msg.save();
      console.log("message saved:", message);
    } catch (err) {
      resp={success:false, data:[], message:"error while saving the message in 'messages' collection"};
      console.log(err);
      return resp;
    } 

    
    await updateUserContactChatId(data.sender_id, data.receiver_id, new_msg._id );
    await updateUserContactChatId(data.receiver_id, data.sender_id, new_msg._id );

    resp = {
      success: true,
      data: message,
      message: "stored the message and updated lastMsgId",
    };
    return resp;
    

}

export const resetUnreadMessage = async (self_id, peer_id)=>{
  try {
    const result = await User.findOneAndUpdate(
      { _id: self_id, "user_contacts._id": peer_id }, // Match the user and specific contact
      {
        $set: {
          "user_contacts.$.unread_messages": 0, // Update only the chat_id
        },
      },
      { new: true } // Return the updated document
    );

    if (result) {
      console.log("unread_messages reset to zero");
    } else {
      console.log("No matching contact found.");
    }
  } catch (error) {
    console.error("Error reseting unread_messages:", error);
  }

  return 1;

}