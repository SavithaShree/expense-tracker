'use strict'

const role_admin = 1;

var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const generatePwd = require('generate-password');

module.exports = {
    async create(request, h) {
        try {
            var user = request.payload.user;
            var email = request.payload.email;
            if (request.payload.roleId == role_admin) {
                await connection.query('INSERT into user (name, email) VALUES ("' + user + '", "' +email+ '")', (error, result) => {
                    if (error) {
                        return error;
                    }
                });
                var transporter = nodemailer.createTransport(smtpTransport({
                    host: "smtp-mail.outlook.com",
                    secureConnection: false,
                    port: 587,
                    auth: {
                        user: "savitha.mohanraj@aspiresys.com",
                        pass: "mkwqxwbsffvnmwbv"
                    },
                    tls: {
                        ciphers:'SSLv3'
                    },
                }));

                const password = generatePwd.generate({
                    length: 20,
                    numbers: true
                });

                connection.query('INSERT into user (password) VALUES ("' + password + '")', (error, result) => {
                    if (error) {
                        return error;
                    }
                });
                                
                const mailOptions = {
                    from: '"Tester" <savitha.mohanraj@aspiresys.com>',
                    to: `${email}`,
                    subject: 'Test mail', 
                    html: `<p>Hi ${user}</p><p>The credentials to login are given below. Please use this:</p><p>email: ${email}</p><p>password: ${password}</p>`
                };
                                
                transporter.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(response);
                    }

                });

              return true;
            } else {
                return h.response(`User doesn't have the privilege to add new user`).code(500);
            }

        }
        catch (error) {
            return h.response(error).code(500);

        }
    },

    async getList(request,h) {
        try {
            const QueryResult = (query) => {
                return new Promise((resolve, reject) => {
                    connection.query(`SELECT * FROM user`, (err, result) => {
                        if (err) return reject(err);           
                        return resolve(result)
                    });
                })
            }
            const list = await QueryResult(`SELECT * FROM user`);
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
                    connection.query('SELECT * FROM user WHERE id="'+ id +'"', (err, result) => {
                        if (err) return reject(err);           
                        return resolve(result)
                    });
                })
            }
            const selected = await QueryResult('SELECT * FROM user WHERE id="'+ id +'"');
            return selected;
        }
        catch (error) {
            return h.response(error).code(500);
        }
    },

    async update(request, h) {
        try {
            const name = request.payload.name;
            const id = request.params.id;
            const selected = await connection.query('UPDATE user SET name="'+ name +'" WHERE id='+ id +'', (error, result) => {
                if(error) {
                    return error;
                }
                return result;
            })
            return h.response(selected);
        }
        catch(error) {
            return h.response(error).code(500);
        }
    },

    async delete(request, h) {
        try {
            const id = request.params.id;
            const selected = await connection.query('DELETE FROM user WHERE id='+ id +'', (error, result) => {
                if(error) {
                    return error;
                }
                return result;
            })
            return h.response(selected);
        }
        catch(error) {
            return h.response(error).code(500);
        }
    }
}