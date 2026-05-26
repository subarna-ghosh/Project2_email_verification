const express = require("express");
const Router=express.Router();

const apiRoutes=require('./authRoutes');
Router.use('/u1',apiRoutes);

const adminRoutes=require('./adminRoute');
Router.use('/u1',adminRoutes);

const userRoutes=require('./userRoute');
Router.use('/u1',userRoutes);

module.exports=Router;