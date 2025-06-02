const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const { protected, isAdmin } = require("../middleware/authMiddleware");

router.post("/signup", authController.Signup);
router.post("/verifyEmail", authController.verifyEmail);
router.post("/login", authController.Login);
router.post("/sendOTPForgotPassword", authController.sendOTPForgotPassword);
router.post("/resetPassword", authController.resetPassword);
router.post("/changePassword", protected, authController.changePassword);
router.post("/logout", authController.Logout);
router.get("/get-user", protected, authController.getUser);


module.exports = router;
