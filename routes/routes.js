const express = require('express');
const router = express.Router();
const {createUser,signIn} = require("../controller/userController");
const { createTask, getAllTasks, updateTask, deleteTask } = require('../controller/taskController');
const { authentication } = require('../middlewares/jwtValidation');

router.post("/createUser",createUser);
router.post("/signIn",signIn);
router.post("/createtask",authentication,createTask);
router.get("/allTasks",authentication,getAllTasks);
router.put("/updatetask",authentication,updateTask);
router.post("/deletetask",authentication,deleteTask);

module.exports = router