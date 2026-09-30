import bcrypt from "bcryptjs";
import User from "../models/User.js";
const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profilePhoto: user.profilePhoto,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});


export const login=async(req,res,next)=>{try{const {email,password}=req.body;if(typeof email!=="string"||typeof password!=="string")return res.status(400).json({ok:false,message:"email y password obligatorios"});const user=await User.findOne({email:email.trim().toLowerCase()}).select("+password");if(!user||!await bcrypt.compare(password,user.password))return res.status(401).json({ok:false,message:"Credenciales incorrectas"});res.json({ok:true,message:"Login correcto",user:publicUser(user)});}catch(e){next(e);}};

