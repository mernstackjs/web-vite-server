const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utility/sendmail");

exports.Register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Fadlan buuxi meelahan banaan" });
    }
    const userFound = await User.findOne({ email });
    if (userFound) return res.send("This user is registered");
    const user = await new User({ email, password, username });
    user.verificationCode();
    user.save();
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Fadlan buuxi meelahan banaan" });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(404).send("ma jiro userkani");
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(404).send("password aad gelisay waa mid khalad ah ");
    const { password: pass, ...others } = user._doc;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    res.cookie("access_token", token);
    res.json({ User: others });
  } catch (error) {
    res.status(404).json({ Error: error.message });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const userID = req.user;
    const user = await User.findById(userID).select("+emailVerify");
    if (!user) return res.status(403).json({ message: "Dont have this user" });
    res.json(user);
  } catch (error) {
    res.send(error);
  }
};
exports.allUser = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
exports.sendEmailVerificationCode = async (req, res) => {
  try {
    const userID = req.user;
    const user = await User.findById(userID).select("+emailVerificationCode");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the email verification code has expired
    // if (user.emailVerificationCodeExpires && user.emailVerificationCodeExpires < Date.now()) {
    //     return res.status(400).json({ message: "Email verification code has expired" });
    //   }

    const Link = `http://localhost:8080/verify?code=${user.emailVerificationCode}`;

    const emailContent = {
      to: user.email,
      subject: "Verification Code",
      text: "you can verify your email",
      html: `please verify your email to click this link ${Link} and this code is expire after 10 minutes`,
    };
    sendMail(
      emailContent.to,
      emailContent.subject,
      emailContent.text,
      emailContent.html
    );
    res.json({ message: "Email verification code sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const code = req.query.code;
    const user = await User.findOne({ emailVerificationCode: code }).select(
      "+emailVerify"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.emailVerify = true;
    await user.save();
    res.json("success your email is verify now");
  } catch (error) {}
};
