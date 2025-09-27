const express = require("express");
const userRoute = express.Router();
const userController = require("../Controllers/userController");

//------- register --------
/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     responses:
 *       201:
 *         description: add user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 default: "ab@gmail.com"
 *               password:
 *                 type: string
 */
userRoute.post("/register", userController.register);

//------- login --------
/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login user and get JWT
 *     tags: [User]
 *     responses:
 *       201:
 *         description: login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: "ab@gmail.com"
 *               password:
 *                 type: string
 */
userRoute.post("/login", userController.login);

//------- get all users --------
/**
 * @openapi
 * /getAllUsers:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: list of all users
 */
userRoute.get("/getAllUsers", userController.getAllUsers);

//------- get user by id --------
/**
 * @openapi
 * /getUserById/:id:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     responses:
 *       200:
 *         description: User object
 *       404:
 *         description: User not found
 */
userRoute.get("/getUserById/:id", userController.getUserById);

//------- delete user by id --------
/**
 * @openapi
 * /deleteUserById/:id:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
userRoute.delete("/deleteUserById/:id", userController.deleteUserById);

//------- update user --------
/**
 * @openapi
 * /updateUser/{id}:
 *   patch:
 *     summary: Update user fields
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
userRoute.patch("/updateUser/:id", userController.updateUser);

//--------------export user route--------
module.exports = userRoute;
