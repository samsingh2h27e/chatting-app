import { User } from "../db/userModel.js";

export const updateUserContactChatId = async(userId, contactId, newChatId)=> {
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