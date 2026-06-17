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
        res.status(500).json({error:"internal service error"})
    }
    
}
export const getMessages = async (req , res) => {
    try {
        const {userToChatId} = req.params
        const myId = req.user._id;

        const messages = await message.find({
            $or:[{senderId:myId, receiver:userToChatId},
                {senderId:userToChatId, receiver:myId}   
            ]
        })
        res.status(200).json({messages})
    } catch (error) {
         console.error("error in getMessages controller :", error.message)
        res.status(500).json({error:"internal service error"})
    }
    
}
export const sendMessages = async (req , res) => {
    try {
        const {text , image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        

        let imageURL;
        if(image){
            // upload base64 image to cloudinary
            const UploadResponse = await cloudinary.uploader.upload(image)
            imageURL = UploadResponse.secure_url;

        }
    
        const newMessage = new message({
            senderId,
            receiverId,
            text,
            image:imageURL,
        });       
        await newMessage.save();

        // real-time functionaliy with socket.io


        res.status(201).json(newMessage);
    } catch (error) {
        console.log("error in sendmessage controller: ", error.message);
        console.log("error in sendmessage controller: ", error.message);
    }
}