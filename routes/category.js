'use strict';

const categoryController = require('../controller/category');
const Joi = require('@hapi/joi');

module.exports = [
    {
        method: 'POST',
        path: '/category',
        options: {
            validate: {
                payload: Joi.object({
                    categoryName: Joi.string().min(3).max(25).required(),
                    roleId: Joi.required()
                })
            },
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: categoryController.create,
    },
    {
        method: 'GET',
        path: '/categories',
        handler: categoryController.getList
    },
    {
        method: 'GET',
        path: '/category/{id}',
        handler: categoryController.getById,
    },
    {
        method: 'PUT',
        path: '/category/{id}',
        handler: categoryController.update,
    },
    {
        method: 'DELETE',
        path: '/category/{id}',
        handler: categoryController.delete,
    }       
]