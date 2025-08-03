import express from 'express';
import Voluntier from '../models/user.model.js';
import bcrypt from 'bcrypt'
import mongoose from "mongoose";



const router= express.Router();

// Register a new user
export const registerUser = async( req, res)=>{
    const { username, email, password, confirmPassword } = req.body;
    try{
        // check if user already exist
        if(await Voluntier.findOne({ email })){
            return res.status(400).json({ message: 'User already exists' });
        }

        // check if password not matching
        if(password !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match"});
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Voluntier({
            username,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            createdAt: new Date()
        })

        const savedUser = await newUser.save();
        console.log('User registered successfully: ', savedUser)
        
    }catch(err){
        console.error(`Error registering user: ${err.message}`);
        res.status(500).json({ message: 'Server error' });
    }
}


export const loginUser = async( req, res)=>{
    const {email, password}= req.body;
    try{
        const user = await Voluntier.findOne({email});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful', user });
    }catch(err){
        console.error(`Error logging in user: ${err.message}`);
        res.status(500).json({ message: 'Server error' });
    }
}


export const updateUserDetails = async (req, res)=>{
    const {userId , username, email, password} = req.body;
    try{
        const user = await Voluntier.findById(userId);
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        user.username = username || user.username;
        user.email = email || user.email;
        if(password){
            user.password= await bcrypt.hash(password, 10);
        }
        user.updatedAt = new Date();

        const updatedUser = await user.save();
        res.status(200).json({message:"User details updated successfully", user: updatedUser});
    }catch(err){
        console.error(`Error updating user details: ${err.message}`);
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deletedUser = await Voluntier.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllUser = async (req, res) => {
  try {
    const users = await Voluntier.find().select('-password'); // exclude passwords
    res.status(200).json(users);
  } catch (err) {
    console.error("Error in getAllUser:", err.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export default{
    registerUser,
    loginUser,
    updateUserDetails,
    deleteUser,
    getAllUser
}