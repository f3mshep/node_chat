const jwt = require("jsonwebtoken");

SALT = process.env.JWT_SECRET;

const isValidToken = (token) => {

  try {
    jwt.verify(token, SALT);
  } catch (e) {
    console.log('Bad token')
    return false;
  }
  return true;
};

module.exports = { isValidToken };