import { generatetoken } from "../libs/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../libs/cloudinary.js"; 

export const signup = async (req, res) => {
    const { fullname, password, profilePic, email } = req.body;
    try {
        if (password.length < 6 ) {
            return res.status(400).json({ message: "password must be at least 6 letters long" });
        }
        
        // 1. Check if user already exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "email already exists" }); 

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create new instance using the 'User' model
        const newUser = new User({ 
           fullname,
            email,
            password: hashedPassword,
            profilePic 
        });

        if (newUser) {
            // generate jwt token
            generatetoken(newUser._id, res);
            await newUser.save();
            
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "invalid user data" });
        }

    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({ message: "internal server error" });
    }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generatetoken(user._id, res); // Fixed case sensitivity (lowercase 't')

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname, // Matches 'fullname' structure from signup
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Added 'async' here to fix the SyntaxError
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "updateProfile data is required" });
        }
        
        const uploadeResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilePic: uploadeResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ message: "Error uploading profile picture" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error checking authentication:", error);
        res.status(500).json({ message: "Error checking authentication" });
    }
};