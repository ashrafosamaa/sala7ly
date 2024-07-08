import Joi from "joi";

export const addServiceValidator = {
    body: Joi.object({
        title: Joi.string().required().min(3)
    })
}


export const getAllServicesValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
    })
}


export const IDValidator = {
    params: Joi.object({
        serviceId: Joi.string().length(24).hex().required()
    })
}


export const updateServiceValidator = {
    params: Joi.object({
        serviceId: Joi.string().length(24).hex().required()
    }),
    body: Joi.object({
        title: Joi.string().required().min(3)
    })
}


export const searchValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
        title: Joi.string().optional(),
    })
}