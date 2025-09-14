import { createToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs'
//user sign up
export const signUp = async(req,res)=>{
    const{fullName,email,password,bio} = req.body;
    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success:false,message:"Missing Details"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.json({success:false,message:"Account already exists"});
        }
        const salt =await bcrypt.genSalt(10);
        const hashedPass =await bcrypt.hash(password,salt);
        const newUser =await User.create({
            fullName,email,password:hashedPass,bio
        });
        const token = createToken(newUser._id);
        res.json({success:true, userData:newUser,token,message:"Account created successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const userData = await User.findOne({email});
        if(!userData){
            return res.json({success:false,message:"User does not exist"});
        }
        const isPassCorrect = await bcrypt.compare(password,userData.password);
        if(!isPassCorrect){
            return res.json({success:false,message:"Invalid Credentials"});
        }
        const token= createToken(userData._id);
        res.json({success:true, userData,token,message:"Logged in successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}