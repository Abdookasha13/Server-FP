const express = require("express");
const lessonRoute = express.Router();
const lessonController = require("../Controllers/lessonController");

//------- Add Lesson --------
/**
 * @openapi
 * /addLesson:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lesson]
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Bad request - validation error
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course
 *               - title
 *             properties:
 *               course:
 *                 type: string
 *                 description: MongoDB Course ID
 *                 default: "507f1f77bcf86cd799439011"
 *               title:
 *                 type: string
 *                 default: "Introduction to Programming"
 *               type:
 *                 type: string
 *                 enum: [video, article, quiz]
 *                 default: "video"
 *               content:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               duration:
 *                 type: number
 *                 description: Duration in minutes
 *               order:
 *                 type: number
 *               isPreview:
 *                 type: boolean
 *                 default: false
 */
lessonRoute.post("/addLesson", lessonController.createLesson);

//------- Get All Lessons --------
/**
 * @openapi
 * /getAllLessons:
 *   get:
 *     summary: Get all lessons
 *     tags: [Lesson]
 *     responses:
 *       200:
 *         description: List of all lessons
 *       500:
 *         description: Server error
 */
lessonRoute.get("/getAllLessons", lessonController.getAllLessons);

//------- Get Lesson By ID --------
/**
 * @openapi
 * /getLesson/{id}:
 *   get:
 *     summary: Get a lesson by ID
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB lesson ID
 *     responses:
 *       200:
 *         description: Lesson object
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
lessonRoute.get("/getLesson/:id", lessonController.getLessonById);

//------- Delete Lesson By ID --------
/**
 * @openapi
 * /deleteLesson/{id}:
 *   delete:
 *     summary: Delete a lesson by ID
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB lesson ID
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
lessonRoute.delete("/deleteLesson/:id", lessonController.deleteLessonById);

//------- Update Lesson --------
/**
 * @openapi
 * /updateLesson/{id}:
 *   put:
 *     summary: Update lesson fields
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB lesson ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course:
 *                 type: string
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [video, article, quiz]
 *               content:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               duration:
 *                 type: number
 *               order:
 *                 type: number
 *               isPreview:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: Lesson not found
 */
lessonRoute.put("/updateLesson/:id", lessonController.updateLesson);

//--------------Export Lesson Route--------
module.exports = lessonRoute;
