require("dotenv").config();
const express = require("express");
const cors=require('cors');
const app = express();
const db=require('./app/config/db');
db();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const router = require("./app/routes");
app.use(router);

const port=3000;
app.listen(port,()=>{
    console.log(`server is running on port-->http://localhost:${port}`);
})