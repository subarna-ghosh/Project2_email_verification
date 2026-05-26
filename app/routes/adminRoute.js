const express = require("express");
const Router = express.Router();
const AdminController = require("../controllers/AdminController");
const authCheck=require("../middlewares/authCheck");
const authorizeRoles=require("../middlewares/authorizeRoles");

Router.get("/view",authCheck,authorizeRoles("admin"),AdminController.getAllUsers);
Router.get("/view/:id",authCheck,authorizeRoles("admin"),AdminController.viewUser);

module.exports = Router;
