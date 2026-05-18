import mongoose from "mongoose";
import { stringify } from "postcss";

const userSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            unique:true,

        },
        Fullname:{
            type:String,
            required: true,
        },
        password:{
            type:String,
            required:true,
            minlength:6,
        },
        profilePic:{
            type:String,
            default:"",
        },
    },
    {timestamps:true}
)
const User = mongoose.model("User", userSchema)
export default User
