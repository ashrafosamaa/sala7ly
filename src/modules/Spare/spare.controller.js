import { APIFeatures } from "../../utils/api-features.js";
import { generateUniqueString } from "../../utils/generate-unique-string.js";

import slugify from "slugify";

import Spare from "../../../DB/models/spare.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";

export const addSpare = async (req, res, next)=> {
    // destruct data from user
    const { title, stock, basePrice, discount } = req.body
    // slug
    const slug = slugify(title, '-')
    // price calculation
    const appliedPrice = basePrice - (basePrice * ((discount || 0) / 100))
    // upload image
    let coverImage
    const folderId = generateUniqueString(4)
    if(!req.file){
        return next (new Error("Image is required", { cause: 400 }))
    }
    const {secure_url, public_id} = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/Spares/${folderId}`
    })
    coverImage = {
        secure_url,
        public_id
    }
    // spare
    const spare = {
        title, slug, folderId, basePrice,
        discount, appliedPrice, stock, coverImage
    }
    const newSpare = await Spare.create(spare)
    if(!newSpare) {
        return next(new Error('Error while creating spare', { cause: 500 }))
    }
    // send response
    res.status(201).json({ 
        msg: 'Spare added successfully', 
        statusCode: 201
    })
}

export const getAllSpares = async (req, res, next)=> {
    // destruct data from req.query
    const {page, size} = req.query
    const features = new APIFeatures(req.query, Spare.find().select("-createdAt -updatedAt -__v -folderId"))
    .pagination({page, size})
    const spare = await features.mongooseQuery
    if(!spare.length) {
        return next(new Error('No Spares found', { cause: 404 }))
    }
    res.status(200).json({ 
        msg: "Spares fetched successfully", 
        statusCode: 200, 
        spare 
    })
}

export const getSpareById = async (req, res, next)=> {
    // destruct data from req.params
    const {spareId} = req.params
    const spare = await Spare.findById(spareId).select("-createdAt -updatedAt -__v -folderId")
    if(!spare) {
        return next(new Error('No spare found', { cause: 404 }))
    }
    res.status(200).json({ 
        msg: "Spare fetched successfully", 
        statusCode: 200, 
        spare
    })
}

export const updateSpare = async (req, res, next)=> {
    // destruct data from the user
    const { title, basePrice, discount, stock } = req.body
    const { spareId } = req.params
    // check that spare is found 
    const spare = await Spare.findById(spareId)
    if(!spare){
        return res.status(404).sparejson({
            msg: "Spare not found"
        })
    }
    // title, specs
    if(title){
        spare.title = title
        spare.slug = slugify(title, '-')
    }
    if(stock) spare.stock = stock
    // prices calculation
    const appliedPrice = (basePrice || spare.basePrice) 
    - ((basePrice || spare.basePrice) * ((discount || spare.discount) / 100));
    spare.appliedPrice = appliedPrice
    if (discount) spare.discount = discount
    if (basePrice) spare.basePrice = basePrice
    // update spare
    const updatedSpare = await spare.save()
    res.status(200).json({
        msg: 'Spare updated successfully',
        statusCode: 200, 
        updatedSpare 
    })
}

export const deleteSpare = async (req, res, next)=> {
    // destruct data from ceo
    const {spareId} = req.params
    // delete spare
    const spareDeleted = await Spare.findById(spareId)
    if (!spareDeleted) {
        return next(new Error('Error while deleting Spare', { cause: 404 }))
    }
    const folder = `${process.env.MAIN_FOLDER}/Spares/${spareDeleted.folderId}`
    await cloudinaryConnection().api.delete_resources_by_prefix(folder)
    await cloudinaryConnection().api.delete_folder(folder)
    await spareDeleted.deleteOne()
    // send response
    res.status(200).json({
        msg: "Spare deleted successfully",
        statusCode: 200
    })
}

export const search = async (req, res, next)=> {
    // destruct data from req.query
    const {...serach} = req.query
    const features = new APIFeatures(req.query, Spare.find().select("-createdAt -updatedAt -__v -folderId -desc"))
    .searchTitle(serach)
    const service = await features.mongooseQuery
    if(!service.length) {
        return next(new Error('No Spare found', { cause: 404 }))
    }
    res.status(200).json({
        msg: "Spares fetched successfully",
        statusCode: 200,
        service 
    })
}