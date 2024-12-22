import {User} from '../db/userModel.js'

const existingUser = async(email) =>{
    const exists =  await User.exists({_id: email});
    return exists;
}

const createUser = async (data) => {//// data = object containing user's provided info

  const newUser = new User({
    _id: data.email, // Custom _id
    username: data.fname +" "+ data.lname,
    password: data.password,
    user_contacts: [],
  });

  try {
    const user = await newUser.save();
    console.log("User saved:", user);
  } catch (err) {
    console.error("Error saving user:", err);
  }
};

const findUser = async (data)=>{ /// data = the email which is _id in the our document
    const user = await User.findById(data);
    return user;

};


export const registerController = async ( req, res) =>{
    console.log(req.body, "client is sending  his register data in post req");///

    if (existingUser(req.body.email)){
        res.json({
            success:false,
            message:`User with email id "${req.body.email}" already exists, please login`
        })
        return;
    }

    createUser(req.body);
    res.json({
        success:true,
        message:"Now you are registered"
    });

};

export const loginController = async (req, res)=>{
//   console.log(req.body, "client is sending  his login data in post req"); ///

  const user = await findUser(req.body.email);

  if (user){
    // console.log(user);

    if (user.password === req.body.password){
        res.json({
          success: true,
          message: "Successfully Logged in",
        });

    } else {
        res.json({
          success: false,
          message: "Incorrect password",
        });
    } 

  } else{
    res.json({
      success: false,
      message: "User not found",
    });
  }
};