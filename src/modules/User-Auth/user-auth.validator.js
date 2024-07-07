import Joi from "joi";

export const signupValidator = {
    body: Joi.object({
        firstName : Joi.string().required().min(3),
        lastName : Joi.string().required().min(3),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, "i")
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
        }),
        passwordConfirm: Joi.string().required().valid(Joi.ref('password')),
        phoneNumber: Joi.string().required().length(11).pattern(/^[0-9]+$/, "i"),
    })
}


export const verifyEmailValidator = {
    body: Joi.object({
        email: Joi.string().email().required(),
        activateCode : Joi.string().required().length(4),
    })
}


export const signinValidator = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8),
    })
}


export const forgetPasswordValidator = {
    body: Joi.object({
        email: Joi.string().email().required(),
    })
}


export const verifyCodeValidator = {
    body: Joi.object({
        email: Joi.string().email().required(),
        resetCode : Joi.string().required().length(4),
    })
}


export const resetPasswordValidator = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, "i")
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
        }),
        passwordConfirm: Joi.string().required().valid(Joi.ref('password')),
    })
}


export const resendCodeValidator = {
    body: Joi.object({
        email: Joi.string().email().required(),
    })
}