import { User } from "../db/userModel.js";
import { Message } from "../db/messageModel.js";

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