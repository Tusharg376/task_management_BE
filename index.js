const express = require("express");
const app = express();
const mysql = require("mysql");
const routes = require("./routes/routes");
const multer = require("multer");
const cors = require("cors");

app.use(express.json());
require('dotenv').config()
app.use(multer().any());
app.use(cors({origin:"*"}));



const connection = mysql.createConnection({
    host:process.env.SQL_HOST,
    user: process.env.SQL_USER,	
    database:process.env.SQL_DB,    
    password:process.env.SQL_PASSWORD
});

connection.connect((err)=>{
    if(err) console.log(err);
    else console.log("database connection established");
});

app.use((req,res,next)=>{
    req.db = connection;
    next();
});

app.use("/",routes);

app.listen(3001,(req,res)=>{
    console.log("server connected on post 3001");
});