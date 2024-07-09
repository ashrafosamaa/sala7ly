import { APIFeatures } from "../../utils/api-features.js";
import { generateUniqueString } from "../../utils/generate-unique-string.js";

import Service from "../../../DB/models/service.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";

import slugify from "slugify"; 

export const addService = async (req, res, next)=> {
    // destruct data from req.body
    const {title} = req.body
    // check name
    const isNameExist = await Service.findOne({title})
    if(isNameExist) return next(new Error('This title is already exist, Please try another title', { cause: 409 }))
    // slug
    const slug = slugify(title, '-')
    // upload image
    let serviceImg
    const folderId = generateUniqueString(4)
    if(!req.file){
        return next (new Error("Image is required", { cause: 400 }))
    }
    const {secure_url, public_id} = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/Services/${folderId}`
    })
    serviceImg = {
        secure_url,
        public_id
    }
    // create new service
    const newService = {
        title,
        slug,
        serviceImg,
        folderId
    }
    const serviceCreated = await Service.create(newService)
    if (!serviceCreated) {
        return next(new Error('Error while adding Service', { cause: 500 }))
    }
    // send response
    res.status(201).json({
        msg: "Service added successfully",
        statusCode: 201
    })
}

export const getAllServices = async (req, res, next)=> {
    // destruct data from req.query
    const {page, size} = req.query
    const features = new APIFeatures(req.query, Service.find().select("-createdAt -updatedAt -__v -folderId"))
    .pagination({page, size})
    const service = await features.mongooseQuery
    if(!service.length) {
        return next(new Error('No Services found', { cause: 404 }))
    }
    res.status(200).json({ 
        msg: "Services fetched successfully", 
        statusCode: 200, 
        service 
    })
}

export const getServiceById = async (req, res, next)=> {
    // destruct data from req.params
    const {serviceId} = req.params
    const service = await Service.findById(serviceId).select("-createdAt -updatedAt -__v -folderId")
    if(!service) {
        return next(new Error('No service found', { cause: 404 }))
    }
    res.status(200).json({ 
        msg: "Service fetched successfully", 
        statusCode: 200, 
        service
    })
}

export const updateService = async (req, res, next)=> {
    // destruct data from ceo
    const {serviceId} = req.params
    const {title} = req.body
    // check name
    const isNameExist = await Service.findOne({title, _id: {$ne: serviceId}})
    if(isNameExist) return next(new Error('This title is already exist, Please try another title', { cause: 409 }))
    // slug
    const slug = slugify(title, '-')
    // update Service
    const serviceUpdated = await Service.findByIdAndUpdate(serviceId, {title, slug}, {new: true}).select("-createdAt -updatedAt -__v -folderId")
    if (!serviceUpdated){
        return next(new Error('Error while updating Service', { cause: 500 }))
    }
    // send response
    res.status(200).json({
        msg: "Service updated successfully",
        statusCode: 200,
        serviceUpdated
    })
}

export const deleteService = async (req, res, next)=> {
    // destruct data from ceo
    const {serviceId} = req.params
    // delete service
    const serviceDeleted = await Service.findById(serviceId)
    if (!serviceDeleted) {
        return next(new Error('Error while deleting Service', { cause: 404 }))
    }
    const folder = `${process.env.MAIN_FOLDER}/Services/${serviceDeleted.folderId}`
    await cloudinaryConnection().api.delete_resources_by_prefix(folder)
    await cloudinaryConnection().api.delete_folder(folder)
    await serviceDeleted.deleteOne()
    // send response
    res.status(200).json({
        msg: "Service deleted successfully",
        statusCode: 200
    })
}

export const search = async (req, res, next)=> {
    // destruct data from req.query
    const {...serach} = req.query
    const features = new APIFeatures(req.query, Service.find().select("-createdAt -updatedAt -__v -folderId"))
    .searchTitle(serach)
    const service = await features.mongooseQuery
    if(!service.length) {
        return next(new Error('No Service found', { cause: 404 }))
    }
    res.status(200).json({
        msg: "Services fetched successfully",
        statusCode: 200,
        service 
    })
}