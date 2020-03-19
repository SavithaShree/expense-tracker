const mysql = require('mysql');
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt');
const Boom = require('boom');

const userModel = require('./models/user');

const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const departmentRoute = require('./routes/department');

const server = new Hapi.Server({
    port: 8000,
    host: 'localhost'
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'BuJjU123',
    database: 'sample'
});

connection.connect(function (err) {
    if (err) {
        return console.log('error:', err);
    }
    console.log('Connected to MySQL');
})

// --------------------------------------------Hashing-----------------------------------
function hashPassword(password, cb) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, (error, hash) => {
        return cb(error, hash);
      });
    });
  }

  server.route({
      method: 'POST',
      path: '/login',
      handler: async (request, h) => {
        try {
            var email = request.payload.email;
            console.log('email', email);
            var password = request.payload.password;
            console.log('password', password);
            var result = await hashPassword(password, (error, hash) => {
            if (error) {
              throw Boom.badRequest(error);
            }
            console.log('hash--', hash);
            return hash;
          })
        console.log('result', result);
        }
        catch(error) {
            return h.response(error).code(500);
        }
      }
  })

// --------------------------Authentication-------------------------------

server.register(require('hapi-auth-jwt'), (err) => {
    server.auth.strategy('jwt', 'jwt', {
      key: secret,
      verifyOptions: { algorithms: ['HS256'] }
    });
});

// // --------------- USER------------------------

// server.route({
//     method: 'POST',
//     path: '/user',
//     options: {
//         validate: {
//             payload: Joi.object({
//                 user: Joi.string().min(3).max(25).required(),
//                 roleId: Joi.required()
//             })
//         },
//         cors: {
//             origin: ['*'],
//             additionalHeaders: ['cache-control', 'x-requested-with']
//         }
//     },
//     handler: async (request, h) => {
//         try {
//             var user = request.payload.user;
//             var email = request.payload.email;
//             console.log('email', email, 'user', user);
//             if (request.payload.roleId == 1) {
//                 await connection.query('INSERT into user (name, email) VALUES ("' + user + '", "' +email+ '")', (error, result) => {
//                     if (error) {
//                         return error;
//                     }
//                 });
//                 var transporter = nodemailer.createTransport(smtpTransport({
//                     host: "smtp-mail.outlook.com",
//                     secureConnection: false,
//                     port: 587,
//                     auth: {
//                         user: "savitha.mohanraj@aspiresys.com",
//                         pass: "mkwqxwbsffvnmwbv"
//                     },
//                     tls: {
//                         ciphers:'SSLv3'
//                     },
//                 }));

//                 const password = generatePwd.generate({
//                     length: 20,
//                     numbers: true
//                 });
//                 console.log('********', password);
                                
//                 const mailOptions = {
//                     from: '"Tester" <savitha.mohanraj@aspiresys.com>',
//                     to: `${email}`,
//                     subject: 'Test mail', 
//                     html: `<p>Hi ${user}</p><p>The credentials to login are given below. Please use this:</p><p>email: ${email}</p><p>password: ${password}</p>`
//                 };
//                 console.log('email receiver', email);
                                
//                 transporter.sendMail(mailOptions, function (error, response) {
//                     if (error) {
//                         console.log(error);
//                     } else {
//                         console.log(response);
//                     }

//                 });

//               return true;
//             } else {
//                 return h.response(`User doesn't have the privilege to add new user`).code(500);
//             }

//         }
//         catch (error) {
//             return h.response(error).code(500);

//         }
//     }
// })

// server.route({
//     method: 'GET',
//     path: '/users',
//     handler: async (request, h) => {
//         try {
//             const QueryResult = (query) => {
//                 return new Promise((resolve, reject) => {
//                     connection.query(`SELECT * FROM user`, (err, result) => {
//                         if (err) return reject(err);           
//                         return resolve(result)
//                     });
//                 })
//             }
//             const list = await QueryResult(`SELECT * FROM user`);
//             return list;
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }

//     }
// })

// server.route({
//     method: 'GET',
//     path: '/user/{id}',
//     handler: async (request, h) => {
//         try {
//             const id = request.params.id;
//             const QueryResult = (query) => {
//                 return new Promise((resolve, reject) => {
//                     connection.query('SELECT * FROM user WHERE id="'+ id +'"', (err, result) => {
//                         if (err) return reject(err);           
//                         return resolve(result)
//                     });
//                 })
//             }
//             const selected = await QueryResult('SELECT * FROM user WHERE id="'+ id +'"');
//             return selected;
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }
//     }
// })

// server.route({
//     method: 'PUT',
//     path: '/user/{id}',
//     handler: async (request, h) => {
//         try {
//             const name = request.payload.name;
//             const email = request.payload.emailAddress;
//             const id = request.params.id;
//             const selected = await connection.query('UPDATE user SET name="' + name + '", email="' +email+ '" WHERE id=' + id + '', (error, result) => {
//                 if (error) {
//                     return error;
//                 }
//                 return result;
//             })
//             return h.response(selected);
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }
//     }
// })

// server.route({
//     method: 'DELETE',
//     path: '/user/{id}',
//     handler: async (request, h) => {
//         try {
//             const id = request.params.id;
//             const selected = await connection.query('DELETE FROM user WHERE id=' + id + '', (error, result) => {
//                 if (error) {
//                     return error;
//                 }
//                 return result;
//             })
//             return h.response(selected);
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }
//     }
// })

// // --------------- CATEGORY------------------------
// server.route({
//     method: 'POST',
//     path: '/category',
//     options: {
//         validate: {
//             payload: Joi.object({
//                 categoryName: Joi.string().min(3).max(25).required(),
//                 roleId: Joi.required()
//             })
//         },
//         cors: {
//             origin: ['*'],
//             additionalHeaders: ['cache-control', 'x-requested-with']
//         }
//     },
//     handler: async (request, h) => {
//         try {
//             var category = request.payload.categoryName;
//             var roleId = request.payload.roleId;
//             if (roleId == 1) {
//                 await connection.query('INSERT into section (name) VALUES ("' + category + '")', (error, result) => {
//                     if (error) {
//                         return error;
//                     }
//                 });
//                 return `Successfully added ${category}`;
//             } else {
//                 return h.response(`User doesn't have the privilege to add new category`).code(500);
//             }

//         }
//         catch (error) {
//             return h.response(error).code(500);

//         }
//     }
// })

// server.route({
//     method: 'GET',
//     path: '/categories',
//     handler: async (request, h) => {
//         try {
//             const QueryResult = (query) => {
//                 return new Promise((resolve, reject) => {
//                     connection.query(`SELECT * FROM section`, (err, result) => {
//                         if (err) return reject(err);           
//                         return resolve(result)
//                     });
//                 })
//             }
//             const list = await QueryResult(`SELECT * FROM section`);
//             return list;
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }

//     }
// })

// server.route({
//     method: 'GET',
//     path: '/category/{id}',
//     handler: async (request, h) => {
//         try {
//             const id = request.params.id;
//             const QueryResult = (query) => {
//                 return new Promise((resolve, reject) => {
//                     connection.query('SELECT * FROM section WHERE id="'+ id +'"', (err, result) => {
//                         if (err) return reject(err);           
//                         return resolve(result)
//                     });
//                 })
//             }
//             const selected = await QueryResult('SELECT * FROM section WHERE id="'+ id +'"');
//             return selected;
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }
//     }
// })

// server.route({
//     method: 'PUT',
//     path: '/category/{id}',
//     handler: async (request, h) => {
//         try {
//             const category = request.payload.categoryName;
//             const id = request.params.id;
//             const selected = await connection.query('UPDATE section SET name="' + category + '" WHERE id=' + id + '', (error, result) => {
//                 if (error) {
//                     return error;
//                 }
//                 return result;
//             })
//             return h.response(selected);
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }
//     }
// })

// server.route({
//     method: 'DELETE',
//     path: '/category/{id}',
//     handler: async (request, h) => {
//         try {
//             const id = request.params.id;
//             const selected = await connection.query('DELETE FROM section WHERE id=' + id + '', (error, result) => {
//                 if (error) {
//                     return error;
//                 }
//                 return result;
//             })
//             return h.response(selected);
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }
//     }
// })

// // -----------------DEPARTMENT--------------------------

// server.route({
//     method: 'POST',
//     path: '/department',
//     options: {
//         validate: {
//             payload: Joi.object({
//                 categoryName: Joi.string().min(3).max(25).required(),
//                 roleId: Joi.required()
//             })
//         },
//         cors: {
//             origin: ['*'],
//             additionalHeaders: ['cache-control', 'x-requested-with']
//         }
//     },
//     handler: async (request, h) => {
//         try {
//             var department = request.payload.departmentName;
//             var roleId = request.payload.roleId;
//             if (roleId == 1) {
//                 await connection.query('INSERT into department (name) VALUES ("' + department + '")', (error, result) => {
//                     if (error) {
//                         return error;
//                     }
//                 });
//                 return `Successfully added ${department}`;
//             } else {
//                 return h.response(`User doesn't have the privilege to add new department`).code(500);
//             }

//         }
//         catch (error) {
//             return h.response(error).code(500);

//         }
//     }
// })

// server.route({
//     method: 'GET',
//     path: '/departments',
//     handler: async (request, h) => {
//         try {
//             const QueryResult = (query) => {
//                 return new Promise((resolve, reject) => {
//                     connection.query(`SELECT * FROM department`, (err, result) => {
//                         if (err) return reject(err);           
//                         return resolve(result)
//                     });
//                 })
//             }
//             const list = await QueryResult(`SELECT * FROM department`);
//             return list;
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }

//     }
// })

// server.route({
//     method: 'GET',
//     path: '/department/{id}',
//     handler: async (request, h) => {
//         try {
//             const id = request.params.id;
//             const QueryResult = (query) => {
//                 return new Promise((resolve, reject) => {
//                     connection.query('SELECT * FROM department WHERE id="'+ id +'"', (err, result) => {
//                         if (err) return reject(err);           
//                         return resolve(result)
//                     });
//                 })
//             }
//             const selected = await QueryResult('SELECT * FROM department WHERE id="'+ id +'"');
//             return selected;
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }
//     }
// })

// server.route({
//     method: 'PUT',
//     path: '/department/{id}',
//     handler: async (request, h) => {
//         try {
//             const department = request.payload.departmentName;
//             const id = request.params.id;
//             const selected = await connection.query('UPDATE department SET name="' + department + '" WHERE id=' + id + '', (error, result) => {
//                 if (error) {
//                     return error;
//                 }
//                 return result;
//             })
//             return h.response(selected);
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }
//     }
// })

// server.route({
//     method: 'DELETE',
//     path: '/department/{id}',
//     handler: async (request, h) => {
//         try {
//             const id = request.params.id;
//             const selected = await connection.query('DELETE FROM department WHERE id=' + id + '', (error, result) => {
//                 if (error) {
//                     return error;
//                 }
//                 return result;
//             })
//             return h.response(selected);
//         }
//         catch (error) {
//             return h.response(error).code(500);
//         }
//     }
// })

server.route(userRoute);
server.route(categoryRoute);
server.route(departmentRoute);


server.start((error) => {

    if (error) {
        throw error;
    }
    console.log('Server running at:', server.info.uri);
});