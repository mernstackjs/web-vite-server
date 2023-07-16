const jwt = require("jsonwebtoken");
exports.createToken = async (userID) => {
  jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};
