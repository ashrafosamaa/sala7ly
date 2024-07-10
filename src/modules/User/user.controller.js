import { APIFeatures } from "../../utils/api-features.js";
import { generateUniqueString } from "../../utils/generate-unique-string.js"

import User from "../../../DB/models/user.model.js";
import SpareOrder from "../../../DB/models/spare-order.model.js";
import ServiceOrder from "../../../DB/models/service-order.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const getAllUsers = async (req, res, next) => {
    // destruct data from req.query
    const {page, size, sortBy} = req.query;
    const features = new APIFeatures(req.query, User.find().select("firstName lastName phoneNumber email"))
        .pagination({ page, size })
        .sort(sortBy)
    const users = await features.mongooseQuery
    if(!users.length) {
        return next(new Error("No users found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "Users data fetched successfully", 
        statusCode: 200,
        users
    })
}

export const getUser = async(req, res, next)=> {
    // destruct data from user
    const {userId} = req.params
    // get user data
    const getUser = await User.findById(userId).select("firstName lastName phoneNumber email profileImg")
    if (!getUser) {
        return next(new Error("User not found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "User data fetched successfully",
        statusCode: 200,
        getUser
    })
}

export const search = async (req, res, next) => {
    // destruct data from user
    const { page, size, ...serach } = req.query;
    // get users data
    const features = new APIFeatures(req.query, User.find().select("firstName lastName phoneNumber email"))
        .pagination({ page, size })
        .searchUsers(serach)
        .sort()
    const users = await features.mongooseQuery
    if (!users.length) {
        return next(new Error("No users found matching with your search query", { cause: 404 }))
    }
    res.status(200).json({
        msg: "Users data fetched successfully",
        statusCode: 200,
        users
    });
}

export const updateUser = async(req, res, next)=> {
    // destruct data from user
    const {userId} = req.params
    const {firstName, lastName, phoneNumber} = req.body
    // find user
    const user = await User.findById(userId).select("firstName lastName phoneNumber email profileImg")
    // check user
    if(!user){
        return next (new Error("User not found", { cause: 404 }))
    }
    // new phone check
    if(phoneNumber){
        const isPhoneExist = await User.findOne({phoneNumber, _id: {$ne: userId} })
        if(isPhoneExist){
            return next (new Error("Phone number is already exists, Please try another phone number", { cause: 409 }))
        }
        user.phoneNumber = phoneNumber
    }
    // update user data
    if(firstName) user.firstName = firstName
    if(lastName) user.lastName = lastName
    await user.save()
    // send response
    res.status(200).json({
        msg: "User updated successfully",
        statusCode: 200,
        user
    })
}

export const deleteUser = async(req, res, next)=> {
    // destruct data from user
    const {userId} = req.params
    // delete user data
    const deleteUser = await User.findById(userId)
    if (!deleteUser) {
        return next (new Error("User not found", { cause: 404 }))
    }
    // check spare orders are done only
    const spareOrders = await SpareOrder.find({userId})
    if(spareOrders.length){
        for(const spareOrder of spareOrders){
            if(spareOrder.orderStatus != "Paid" && spareOrder.orderStatus != "Cancelled"){
                return next (new Error("You cannot delete this account because he has an order or more that is not received yet", 
                    { cause: 400 }))
            }
        }
    }
    // check service orders are done only
    const serviceOrders = await ServiceOrder.find({userId})
    if(serviceOrders.length){
        for(const serviceOrder of serviceOrders){
            if(serviceOrder.orderStatus != "Paid" && serviceOrder.orderStatus != "Cancelled"){
                return next (new Error("You cannot delete this account because he has an order or more that is not received yet", 
                    { cause: 400 }))
            }
        }
    }
    // delete photo
    if(deleteUser.profileImg.public_id){
        const folder = `${process.env.MAIN_FOLDER}/Users/${deleteUser.folderId}`
        await cloudinaryConnection().api.delete_resources_by_prefix(folder)
        await cloudinaryConnection().api.delete_folder(folder)
    }
    await deleteUser.deleteOne()
    // delete user data
    await SpareOrder.deleteMany({userId})
    await ServiceOrder.deleteMany({userId})
    // send response
    res.status(200).json({
        msg: "User deleted successfully",
        statusCode: 200
    })
}

export const addProfilePicture = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    // update user data
    const user = await User.findById(_id).select("firstName lastName phoneNumber email profileImg")
    if (!user) {
        return next (new Error("User not found", { cause: 404 }))
    }
    // upload image
    let profileImg
    const folderId = generateUniqueString(4)
    if(!req.file){
        return next (new Error("Image is required", { cause: 400 }))
    }
    const {secure_url, public_id} = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/Users/${folderId}`
    })
    profileImg = {
        secure_url,
        public_id
    }
    // update user data
    user.profileImg = profileImg
    user.folderId = folderId
    await user.save()
    // send response
    res.status(200).json({
        msg: "User profile picture added successfully",
        statusCode: 200,
        user
    })
}

export const updateProfilePicture = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    const {oldPublicId} = req.body
    // check file is uploaded
    if(!req.file){
        return next (new Error("Image is required", { cause: 400 }))
    }
    // update user data
    const user = await User.findById(_id).select("firstName lastName phoneNumber email profileImg folderId")
    if(user.profileImg.public_id != oldPublicId){
        return next (new Error("You cannot update this profile's profile picture", { cause: 400 }))
    }
    const newPublicId = oldPublicId.split(`${user.folderId}/`)[1]
    const {secure_url, public_id} = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/Users/${user.folderId}`,
        public_id: newPublicId
    })
    user.profileImg.secure_url = secure_url
    user.profileImg.public_id = public_id
    // update user data
    await user.save()
    // send response
    res.status(200).json({
        msg: "User profile picture updated successfully",
        statusCode: 200,
        user
    })
}

export const getAccountData = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    // get user data
    const getUser = await User.findById(_id).select("firstName lastName phoneNumber email profileImg")
    if (!getUser) {
        return next (new Error("User not found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "User data fetched successfully",
        statusCode: 200,
        getUser
    })
}

export const updateProfileData = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    const{firstName, lastName, phoneNumber} = req.body
    // find user
    const user = await User.findById(_id).select("firstName lastName phoneNumber email profileImg")
    // check user
    if(!user){
        return next (new Error("User not found", { cause: 404 }))
    }
    // new phone check
    if(phoneNumber){
        const isPhoneExist = await User.findOne({phoneNumber, _id: {$ne: _id} })
        if(isPhoneExist){
            return next (new Error("Phone number is already exists, Please try another phone number", { cause: 409 }))
        }
        user.phoneNumber = phoneNumber
    }
    // update user data
    if(firstName) user.firstName = firstName
    if(lastName) user.lastName = lastName
    await user.save()
    // send response
    res.status(200).json({
        msg: "User data updated successfully",
        statusCode: 200,
        user
    })
}

export const updatePassword = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    const {password, oldPassword} = req.body
    // find user
    const user = await User.findById(_id)
    // check old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
    if(!isPasswordMatch){
        return next (new Error("Invalid old password", { cause: 400 }))
    }
    // hash password
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    // update user data
    user.password = hashedPassword
    user.passwordChangedAt = Date.now()
    await user.save()
    // generate token
    const userToken = jwt.sign({ id: user._id ,email: user.email , userName: user.firstName, role: user.role},
        process.env.JWT_SECRET_LOGIN,
        {
            expiresIn: "90d"
        }
    )
    // send response
    res.status(200).json({
        msg: "User password updated successfully",
        statusCode: 200,
        userToken
    })
}

export const deleteAccount = async (req, res, next)=> {
    // destruct data from user
    const {_id} = req.authUser
    // delete user data
    const deleteUser = await User.findById(_id)
    if (!deleteUser) {
        return next (new Error("User not found", { cause: 404 }))
    }
    // check spare orders are done only
    const spareOrders = await SpareOrder.find({userId: _id})
    if(spareOrders.length){
        for(const spareOrder of spareOrders){
            if(spareOrder.orderStatus != "Paid" && spareOrder.orderStatus != "Cancelled"){
                return next (new Error("1 You cannot delete this account because you have an order or more that is not received yet", 
                    { cause: 400 }))
            }
        }
    }
    // check service orders are done only
    const serviceOrders = await ServiceOrder.find({userId: _id})
    if(serviceOrders.length){
        for(const serviceOrder of serviceOrders){
            if(serviceOrder.orderStatus != "Paid" && serviceOrder.orderStatus != "Cancelled"){
                return next (new Error("2 You cannot delete this account because you have an order or more that is not received yet", 
                    { cause: 400 }))
            }
        }
    }
    // delete photo
    if(deleteUser.profileImg.public_id){
        const folder = `${process.env.MAIN_FOLDER}/Users/${deleteUser.folderId}`
        await cloudinaryConnection().api.delete_resources_by_prefix(folder)
        await cloudinaryConnection().api.delete_folder(folder)
    }
    await deleteUser.deleteOne()
    // delete user data
    await SpareOrder.deleteMany({userId: _id})
    await ServiceOrder.deleteMany({userId: _id})
    // send response
    res.status(200).json({
        msg: "User deleted successfully",
        statusCode: 200
    })
}