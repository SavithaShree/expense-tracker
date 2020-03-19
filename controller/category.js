'use strict'

const role_admin = 1;

module.exports = {
    async create(request, h) {
        try {
            var category = request.payload.categoryName;
            var roleId = request.payload.roleId;
            if (roleId == role_admin) {
                await connection.query('INSERT into section (name) VALUES ("' + category + '")', (error, result) => {
                    if (error) {
                        return error;
                    }
                });
                return `Successfully added ${category}`;
            } else {
                return h.response(`User doesn't have the privilege to add new category`).code(500);
            }

        }
        catch (error) {
            return h.response(error).code(500);

        }
    },

    async getList(request, h) {
        try {
            const QueryResult = (query) => {
                return new Promise((resolve, reject) => {
                    connection.query(`SELECT * FROM section`, (err, result) => {
                        if (err) return reject(err);           
                        return resolve(result)
                    });
                })
            }
            const list = await QueryResult(`SELECT * FROM section`);
            return list;
        }
        catch (error) {
            return h.response(error).code(500);
        }
    },

    async getById(request, h) {
        try {
            const id = request.params.id;
            const QueryResult = (query) => {
                return new Promise((resolve, reject) => {
                    connection.query('SELECT * FROM section WHERE id="'+ id +'"', (err, result) => {
                        if (err) return reject(err);           
                        return resolve(result)
                    });
                })
            }
            const selected = await QueryResult('SELECT * FROM section WHERE id="'+ id +'"');
            return selected;
        }
        catch (error) {
            return h.response(error).code(500);
        }
    },

    async update(request, h) {
        try {
            const category = request.payload.categoryName;
            const id = request.params.id;
            const selected = await connection.query('UPDATE section SET name="' + category + '" WHERE id=' + id + '', (error, result) => {
                if (error) {
                    return error;
                }
                return result;
            })
            return h.response(selected);
        }
        catch (error) {
            return h.response(error).code(500);
        }
    },

    async delete(request, h) {
        try {
            const id = request.params.id;
            const selected = await connection.query('DELETE FROM section WHERE id=' + id + '', (error, result) => {
                if (error) {
                    return error;
                }
                return result;
            })
            return h.response(selected);
        }
        catch (error) {
            return h.response(error).code(500);
        }
    }
}