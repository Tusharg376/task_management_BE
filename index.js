const express = require("express");
const app = express();
const mysql = require("mysql");
const routes = require("./routes/routes");
const multer = require("multer");
const cors = require("cors");

app.use(express.json());
app.use(multer().any());
app.use(cors({origin:"*"}));

const connection = mysql.createConnection({
    host:"localhost",
    user: "root",	
    database:"task_management",
    password:"tushar.22@"
});

connection.connect((err)=>{
    if(err) connsole.log(err);
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