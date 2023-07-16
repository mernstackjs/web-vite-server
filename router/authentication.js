const {
  Register,
  Login,
  currentUser,
  allUser,
  sendEmailVerificationCode,
  verifyCode,
} = require("../controller/auth");
const { isAuthantication } = require("../middleware/isAuthantication");

module.exports = (router) => {
  router.get("/auth/users", allUser);
  router.post("/auth/register", Register);
  router.post("/auth/login", Login);
  router.get("/auth/verify", verifyCode);
  router.get("/auth/current-user", isAuthantication, currentUser);
  router.get(
    "/auth/send-email-verification-code",
    isAuthantication,
    sendEmailVerificationCode
  );
};
