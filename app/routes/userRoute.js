const express = require("express");
const Router = express.Router();
const UserController = require("../controllers/UserController");
const authCheck=require("../middlewares/authCheck");
const authorizeRoles=require("../middlewares/authorizeRoles");

Router.get("/user/profile",authCheck,authorizeRoles("user"),UserController.userProfile);

module.exports = Router;
