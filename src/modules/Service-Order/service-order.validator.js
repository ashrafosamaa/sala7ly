import Joi from "joi";

export const createOrderValidator = {
    body: Joi.object({
        shippingAddress: Joi.string().required(),
        serviceId: Joi.string().length(24).hex().required(),
        problemDesc: Joi.string().required(), 
        orderDate: Joi.string().required(),
        orderTime: Joi.string().required(), 
        orderType: Joi.string().required().valid("Normal", "Emergency"),
        phoneNumber: Joi.string().required().length(11).pattern(/^[0-9]+$/, "i"),
    })
}


export const noValidator = {
    body: Joi.object({
        zaza: Joi.string().length(2).optional()
    })
}


export const getAllOrdersValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
    })
}


export const IDValidator = {
    params: Joi.object({
        orderId: Joi.string().length(24).hex().required()
    })
}