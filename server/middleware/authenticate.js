const { User } = require('./../models/user');
const jwt = require("jsonwebtoken");

const validateToken= (auth) => {
  try {
    decoded = jwt.verify(auth.token, SALT);
  } catch (e) {
    return false;
  }
  return true;
};


module.exports = { validateToken };