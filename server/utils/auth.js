const jwt = require('jsonwebtoken');
require('dotenv').config();
// set token secret and expiration date
// process.env variable not currently working.  console.logs correctly, but getting an error in graphql playground--SEE ERROR BELOW
// const secret = process.env.JWT_SECRET;
const secret = 'my$3cr3t$hhhhh';
console.log(secret);
const expiration = '2h';

module.exports = {
// arguments to signToken get added to the encoded token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    // return updated request object with .user added
    return req;
  },

};





// "errors": [
//   {
//     "message": "secretOrPrivateKey must have a value",
//     "locations": [
//       {
//         "line": 2,
//         "column": 3
//       }
//     ],
//     "path": [
//       "addUser"
//     ],
//     "extensions": {
//       "code": "INTERNAL_SERVER_ERROR",
//       "exception": {
//         "stacktrace": [
//           "Error: secretOrPrivateKey must have a value",
//           "    at Object.module.exports [as sign] (C:\\Users\\cmcon\\Desktop\\ut coding program\\MODULES\\Module-21-MERN\\challenge\\google-books-search\\server\\node_modules\\jsonwebtoken\\sign.js:107:20)",
//           "    at signToken (C:\\Users\\cmcon\\Desktop\\ut coding program\\MODULES\\Module-21-MERN\\challenge\\google-books-search\\server\\utils\\auth.js:13:16)",
//           "    at addUser (C:\\Users\\cmcon\\Desktop\\ut coding program\\MODULES\\Module-21-MERN\\challenge\\google-books-search\\server\\schemas\\resolvers.js:50:21)",
//           "    at processTicksAndRejections (internal/process/task_queues.js:97:5)"