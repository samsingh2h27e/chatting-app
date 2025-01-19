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
      // console.log("Chat ID updated successfully");
    } else {
      // console.log("No matching contact found.");
    }
  } catch (error) {
    // console.error("Error updating chat ID:", error);
  }
}

function calculateTimeDifference(dateTime) {
  // Parse the date-time strings into Date objects
  const date1 = new Date(dateTime);
  const date2 = new Date();

  // Validate dates
  // if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
  //   throw new Error("Invalid date-time string provided.");
  // }

  // Calculate the difference in milliseconds
  const diffMs = Math.abs(date2 - date1); // Absolute value to avoid negative differences

  // Convert milliseconds to hours and minutes
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours} hours ${minutes} minutes`;
}


export const getLastSeenDateTime = async (_id) =>{
  let user;
  let resp = { success: false, data: "", message: "" };
  try {
    user = await User.findById(_id);
  } catch (error) {
    resp.message = "error while getting the user by id";
    return resp;
  }

  const dateTimeObject = new Date(user.last_seen_date_time);
  const obj = {
    date:dateTimeObject.toLocaleDateString(),
    time : dateTimeObject.toLocaleTimeString(),
    hours : dateTimeObject.getHours(),
    minutes : dateTimeObject.getMinutes()
  }
  let timeAgo = calculateTimeDifference(user.last_seen_date_time);
  resp.data = `Last seen ${timeAgo} ago`;
  
  // resp.data = `Last seen on ${obj.date} at ${obj.hours}:${obj.minutes}`;
  resp.success = true;
  resp.message = 'Sent the last-seen date and time';

  return resp;
}

export const setLastSeenDateTime = async (_id) =>{

  let updatedUser; 
  let resp = { success: true, data: null, message: "" };
  try {
    updatedUser = await User.findByIdAndUpdate(_id,
      {last_seen_date_time:new Date()},
      {new:true}
    );
  } catch (error) {
    resp.success=false;
    resp.message = "error while updating the last seen in db";
    return resp;
  }

  resp.message = "updated last seen in db on logout";
  resp.data = updatedUser;

  return resp;

}