const express = require("express");
const Router=express.Router();
const apiRoutes=require('./authRoutes');
Router.use('/u1',apiRoutes);
module.exports=Router;