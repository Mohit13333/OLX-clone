import pkg from 'bcryptjs';
const { hash, compare } = pkg;
import User from "../models/user.js";
import pkg2 from 'jsonwebtoken';
const { sign } = pkg2;

export const signup=async(req, res)=>{
    const receivedUser=req.body;
    console.log(receivedUser);
    
    const hashedPassword=await hash(receivedUser.password, 8)
    try {
        const emailExist=await User.findOne({"email": receivedUser.email})
        if(emailExist){
            return res.status(409).json({"message": "email already exists"})
        }

        const newUser=new User({
            ...receivedUser,
            password: hashedPassword,
        })
    
        const createUser=await newUser.save();
        
        const authToken=sign({email:receivedUser.email, name: receivedUser.name, mobile:receivedUser.mobile, _id: createUser._id}, process.env.JWT_SECRET)

        return res.json({"message": "signup successful", "token": authToken});

    } catch (error) {
        console.error(error);
        return res.status(500).json({"message": `error during signup: ${error.message}`});
    }
}

export const login = async (req, res)=> {
    const receivedUser=req.body;
    try {
        const userExist = await User.findOne( {"mobile": receivedUser.mobile});
        if (userExist) {
            const validPassword = await compare(receivedUser.password, userExist.password);
            if (validPassword) {
                console.log(userExist._id)
                const authToken=sign({email:userExist.email, username:userExist.username, mobile:userExist.mobile, _id: userExist._id}, process.env.JWT_SECRET)
                return res.json({"message": "You have signed in successfully", "token": authToken});
            } else {
                res.json({"message": "mobie or password didn't match"});
            }
        } else {
            res.json({"message": "mobile or password didn't match"});
        }
    } catch (error) {
        console.log(error);
        res.json({"message": `Error occurred during signin: ${error}`});
    }
}

export const getUser = async (req, res) => {
    const userId=req.body.userId;
    try {
        const user = await User.findOne( {"_id": userId});
        if (user) {
            return res.json(user);
        } else {
            return res.json({"message": "User not found"});
        }
    } catch (error) {
        console.log(error);
        return res.json({"message": `Error occurred during getting user: ${error}`});
    }
}

export const updateUser = async (req, res) => {
    const userId=req.body.userId;
    try {
        const user = await User.findOne( {"_id": userId});
        if (user) {
            const updatedUser = await User.findByIdAndUpdate(userId, updatedUser, {new: true});
            const authToken=sign({email:updatedUser.email, username:updatedUser.username, mobile:updatedUser.mobile, _id: updatedUser._id}, process.env.JWT_SECRET)
            return res.json({"message": "User has been updated successfully", "token": authToken});
        } else {
            return res.json({"message": "User not found"});
        }
    } catch (error) {
        console.log(error);
        return res.json({"message": `Error occurred during updating user: ${error}`});
    }
}

export const deleteUser = async (req, res) => {
    const userId=req.body.userId;
    try {
        const user = await User.findOne( {"_id": userId});
        if (user) {
            User.findByIdAndRemove(userId);
            return res.json({"message": "User deleted successfully"});
        } else {
            return res.json({"message": "User not found"});
        }
    } catch (error) {
        console.log(error);
        return res.json({"message": `Error occurred during deleting user: ${error}`});
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        console.log(error);
        return res.json({"message": `Error occurred during getting users: ${error}`});
    }
}

export const searchUser = async (req, res) => {
    const searchQuery=req.query.searchQuery;
    try {
        const users = await User.find({name: {$regex: searchQuery, $options: "i"}});
        return res.json(users);
    } catch (error) {
        console.log(error);
        return res.json({"message": `Error occurred during searching user: ${error}`});
    }
}