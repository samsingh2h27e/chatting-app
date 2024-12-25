import { User } from "../db/userModel.js";

export const getAllChats = async( id)=>{
    const user = await User.findById(id);

    return user.user_contacts;
    // return user;
}