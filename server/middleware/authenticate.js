const { User } = require('./../models/user');
const jwt = require("jsonwebtoken");

const isValidToken= (auth) => {
  try {
    decoded = jwt.verify(auth.token, SALT);
  } catch (e) {
    return false;
  }
  return true;
};

module.exports = { isValidToken };