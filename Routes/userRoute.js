const express = require("express");
const userRoute = express.Router();
const userController = require("../Controllers/userController");

//------- add --------
userRoute.post("/addUser", userController.creatUser);

//--------------export user route--------
module.exports = userRoute;
