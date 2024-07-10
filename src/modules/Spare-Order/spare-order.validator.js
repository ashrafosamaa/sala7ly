import Joi from "joi";

export const createOrderValidator = {
    body: Joi.object({
        spareId: Joi.string().length(24).hex().required(),
        quantity: Joi.number().required().min(1), 
        paymentMethod: Joi.string().required().valid("Cash", "Online").default("Cash"),
        phoneNumber: Joi.string().required().length(11).pattern(/^[0-9]+$/, "i"),
        shippingAddress: Joi.string().required(),
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