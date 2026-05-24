import { generatetoken } from "../libs/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"


export const signup = async (req,res)=>{
    const{Fullname, password,profilePic, email}= req.body
    try {
        if (password.length < 6 ){
            return res.status(400).json({message:"password must be at least 6 letters long "})
        }
        const user = await User.findOne({email})

        if (User) return res.status(400).json({message:"email already exist"})

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = newUser({
            Fullname,
            email,
            password: hashedPassword,
        })

        if (newUser){
            // generate jwt token
            generatetoken(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                Fullname: newUser.Fullname,
                email:newUser.email,
                profilePic:newUser.profilePic,

            })
        } else{
            res.status(400).json({message:"invalid user data"})
        }

    } catch (error) {
        console.log("error in signup controller",error.message)
        res.status(500).json({message:"internal service error"})
    }
}


export const login = (req,res)=>{
    res.send("login route");
}


export const logout  = (req,res)=>{
    res.send("logout route");
}