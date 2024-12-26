import { User } from "../db/userModel.js";
import { Message } from "../db/messageModel.js";
import { concatenateLexicographically } from "../helpers/stringConcat.js";
import { updateUserContactChatId } from "../helpers/queries.js";


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

        // console.log(last_msg);
        
    } else {
        last_msg = await Message.findById(last_msg_id);
        // console.log(last_msg);
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

    let message=null;

    try {
      message = await new_msg.save();
      console.log("message saved:", message);
    } catch (err) {
      console.error("Error saving message:", err);
      return null;
    } 

    
    await updateUserContactChatId(data.sender_id, data.receiver_id, new_msg._id );
    await updateUserContactChatId(data.receiver_id, data.sender_id, new_msg._id );

    return message;
    

}