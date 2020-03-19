'use strict';

const departmentController = require('../controller/department');
const Joi = require('@hapi/joi');

module.exports = [
    {
        method: 'POST',
        path: '/department',
        options: {
            validate: {
                payload: Joi.object({
                    departmentName: Joi.string().min(3).max(25).required(),
                    roleId: Joi.required()
                })
            },
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: departmentController.create,
    },
    {
        method: 'GET',
        path: '/departments',
        handler: departmentController.getList
    },
    {
        method: 'GET',
        path: '/department/{id}',
        handler: departmentController.getById,
    },
    {
        method: 'PUT',
        path: '/department/{id}',
        handler: departmentController.update,
    },
    {
        method: 'DELETE',
        path: '/department/{id}',
        handler: departmentController.delete,
    }       
]