const express = require("express");
const Router = express.Router();
const AuthController = require("../controllers/AuthController");
const authCheck=require("../middlewares/authCheck");
const authorizeRoles=require("../middlewares/authorizeRoles");
const otpLimiter = require("../middlewares/rateLimiter");

Router.post("/register", otpLimiter, AuthController.register);
Router.post("/verify", otpLimiter, AuthController.verify);
Router.post("/resend/otp", otpLimiter, AuthController.resend);
Router.post("/login", otpLimiter, AuthController.login);
// only admin
Router.get("/view",authCheck,authorizeRoles("admin"),AuthController.getAllUsers);
Router.get("/view/:id",authCheck,authorizeRoles("admin"),AuthController.viewUser);
// user
Router.get("/user/profile",authCheck,authorizeRoles("user"),AuthController.userProfile);

module.exports = Router;
