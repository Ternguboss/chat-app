import User from "../models/user.model";
import messages from "../models/message.model.js";
import { json } from "express";


export const  getUserForSideabar = async (req , res) => {
    try {
        const loggedInUserId = req.user._Id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId} }).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("error in getUserForSidebar:", error.message)
        res.status(200).json({error:"internal service error"})
    }
    
}
export const getMessages = async (req , res) => {
    try {
        const {userToChatId} = req.params
        const myId = req.user.id;

        const messages = await message.find({
            $or:[{senderId:myId, receiver:userToChatId},
                {senderId:userToChatId, receiver:myId}   
            ]
        })
        res.status(200).json({messages})
    } catch (error) {
        
    }
    
}