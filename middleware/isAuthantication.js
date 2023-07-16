const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.isAuthantication = async (req, res, next) => {
  const token = req.cookies["access_token"];
  if (!token)
    return res.status(403).json({ message: "Don't have an access token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    req.user = user._id;
    next();
  } catch (error) {
    res.json(error.message);
  }
};
