const Joi = require('joi');

// Register validation
const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .alphanum()
        .required()
        .messages({
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username cannot exceed 30 characters',
            'string.alphanum': 'Username must contain only letters and numbers',
            'any.required': 'Username is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        })
});

// Login validation
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

// Message validation
const messageSchema = Joi.object({
    recipient: Joi.string()
        .required()
        .messages({
            'any.required': 'Recipient is required'
        }),
    message: Joi.string()
        .min(1)
        .max(1000)
        .required()
        .messages({
            'string.min': 'Message cannot be empty',
            'string.max': 'Message cannot exceed 1000 characters',
            'any.required': 'Message is required'
        })
});

module.exports = {
    registerSchema,
    loginSchema,
    messageSchema
};
