'use strict';

const userController = require('../controller/user');
const Joi = require('@hapi/joi');

module.exports = [
    {
        method: 'POST',
        path: '/user',
        options: {
            validate: {
                payload: Joi.object({
                    user: Joi.string().min(3).max(25).required(),
                    email: Joi.string().email().lowercase().required(),
                    roleId: Joi.required()
                })
            },
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: userController.create,
    },
    {
        method: 'GET',
        path: '/users',
        handler: userController.getList
    },
    {
        method: 'GET',
        path: '/user/{id}',
        handler: userController.getById,
    },
    {
        method: 'PUT',
        path: '/user/{id}',
        handler: userController.update,
    },
    {
        method: 'DELETE',
        path: '/user/{id}',
        handler: userController.delete,
    }       
]