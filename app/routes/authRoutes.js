const express = require("express");
const Router = express.Router();
const AuthController = require("../controllers/AuthController");
const otpLimiter = require("../middlewares/rateLimiter");

Router.post("/register", otpLimiter, AuthController.register);
Router.post("/verify", otpLimiter, AuthController.verify);
Router.post("/resend/otp", otpLimiter, AuthController.resend);
Router.post("/login", otpLimiter, AuthController.login);

module.exports = Router;
