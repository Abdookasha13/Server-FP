const express = require("express");
const userRoute = express.Router();
const userController = require("../Controllers/userController");

//------- add --------
userRoute.post("/addUser", userController.creatUser);

//------- get all users --------
userRoute.get("/getAllUsers", userController.getAllUsers);

//------- get user by id --------
userRoute.get("/getUserById/:id", userController.getUserById);

//------- delete user by id --------
userRoute.delete("/deleteUserById/:id", userController.deleteUserById);

//--------------export user route--------
module.exports = userRoute;
