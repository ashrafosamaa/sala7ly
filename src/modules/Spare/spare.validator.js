import Joi from "joi";

export const addSpareValidator = {
    body: Joi.object({
        title: Joi.string().required().min(3),
        stock: Joi.number().required().min(0).default(1),
        basePrice: Joi.number().required().min(1),
        discount: Joi.number().default(0).min(0).max(99).optional()
    })
}


export const getAllSparesValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
    })
}


export const IDValidator = {
    params: Joi.object({
        spareId: Joi.string().length(24).hex().required()
    })
}


export const updateSpareSchema = {
    body: Joi.object({
        title: Joi.string().min(3).optional(),
        stock: Joi.number().min(0).optional(),
        basePrice: Joi.number().min(1).optional(),
        discount: Joi.number().min(0).max(99).optional(),
    }),
    params: Joi.object({
        spareId: Joi.string().length(24).hex().required(),
    })
}


export const searchValidator = {
    query: Joi.object({
        title: Joi.string().optional(),
    })
}