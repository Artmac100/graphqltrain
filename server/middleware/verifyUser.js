const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = async (req) => {
  const token = req.headers.authorization;

  try {
    const { user } = await jwt.verify(token, secret);
    req.user = user;
  } catch (err) {
    console.log(err);
  }

  req.next();
}