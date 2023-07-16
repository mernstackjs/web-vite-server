const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userShema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: { type: String, required: true, select: false },
  emailVerificationCode: {
    type: String,
    select: false,
  },
  emailVerify: {
    type: Boolean,
    select: false,
    default: false,
  },
});

userShema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
});

userShema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userShema.methods.verificationCode = function () {
  const verifycode = crypto.randomBytes(16).toString("hex");
  this.emailVerificationCode = verifycode;
};

const User = mongoose.model("User", userShema);

module.exports = User;
