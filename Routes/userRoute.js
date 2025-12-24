const express = require("express");
const userRoute = express.Router();
const userController = require("../Controllers/userController");
const authenticate = require("../middleware/authenticationMiddleware");
const authoriz = require("../middleware/authorizationMiddleware");
const FRONT_URL = process.env.FRONT_URL || "http://localhost:5173";
const passport = require("passport");

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65123abc456def7890
 *         name:
 *           type: string
 *           example: abdo
 *         email:
 *           type: string
 *           example: abdo@gmail.com
 *         role:
 *           type: string
 *           example: student
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Enrollment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *         course:
 *           type: object
 *         progress:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               lesson:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *         completed:
 *           type: boolean
 *         certificateUrl:
 *           type: string
 */

//------- register --------
/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: abdo
 *               email:
 *                 type: string
 *                 example: abdo@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 description: User role (optional, default is "student")
 *                 example: student
 *     responses:
 *       201:
 *         description: "User registered successfully. Note: registration does NOT return a JWT token. Use /login to obtain a token."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65123abc456def7890
 *                     name:
 *                       type: string
 *                       example: abdo
 *                     email:
 *                       type: string
 *                       example: abdo@gmail.com
 *                     role:
 *                       type: string
 *                       example: student
 */
userRoute.post("/register", userController.register);

//------- login --------
/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login user and get JWT
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: abc@gmail.com
 *               password:
 *                 type: string
 *                 example: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
userRoute.post("/login", userController.login);

//------- get all users --------
/**
 * @openapi
 * /getAllUsers:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 */
//-----admin only list all users-------
userRoute.get(
  "/getAllUsers",
  authenticate,
  authoriz("admin"),
  userController.getAllUsers
);

//------- get user by id --------
/**
 * @openapi
 * /getUserById/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       404:
 *         description: User not found
 */
//-------- allow admin or the user themself to fetch user details --------
userRoute.get("/getUserById/:id", authenticate, userController.getUserById);

//------- delete user by id --------
/**
 * @openapi
 * /deleteUserById/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
//---------- allow admin or the user themself to delete account ---------
userRoute.delete(
  "/deleteUserById/:id",
  authenticate,
  userController.deleteUserById
);

//------- update user --------
/**
 * @openapi
 * /updateUser/{id}:
 *   patch:
 *     summary: Update user fields
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       404:
 *         description: User not found
 */
//-------- allow admin or the user themself to update account and role changes require admin --------
userRoute.patch("/updateUser/:id", authenticate, userController.updateUser);

//--------set a user's role (promote a student to instructor)---------
/**
 * @openapi
 * /users/{id}/role:
 *   patch:
 *     summary: Admin - set a user's role (student | instructor | admin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *               role:
 *                 type: string
 *                 example: instructor
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
//--------adminonly  set a user's role (promote a student to instructor)---------
userRoute.patch(
  "/users/:id/role",
  authenticate,
  authoriz("admin"),
  userController.setUserRole
);

userRoute.post("/add-to-wishlist", authenticate, userController.addToWishlist);
userRoute.get("/wishlist", authenticate, userController.getWishlist);
userRoute.delete(
  "/remove-from-wishlist/:courseId",
  authenticate,
  userController.removeFromWishlist
);

//------- get all instructors (public) --------
/**
 * @openapi
 * /instructors:
 *   get:
 *     summary: Get all instructors (public)
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of all instructors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                 instructors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       expertise:
 *                         type: string
 *                       experience:
 *                         type: number
 *                       profileImage:
 *                         type: string
 */
userRoute.get("/instructors", userController.getAllInstructors);

// --------------- get instructor by id (public) --------
userRoute.get("/instructors/:id", userController.getInstructorById);

// ----------------sign with google strategy -------------
userRoute.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRoute.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = userController.generateToken(req.user);
    res.redirect(`${FRONT_URL}/google-success?token=${token}`);
  }
);

// ------------------forget password-------------------
userRoute.post("/forgot-password", userController.forgotPassword);

// ------------------reset password-------------------
userRoute.post("/reset-password/:token", userController.resetPassword);

//--------------export user route--------
module.exports = userRoute;
