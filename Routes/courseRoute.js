const express = require("express");
const courseRoute = express.Router();
const courseCtrl = require("../Controllers/courseController");
const authenticate = require("../middleware/authenticationMiddleware");
const authoriz = require("../middleware/authorizationMiddleware");

/**
 * @openapi
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Learn JavaScript"
 *               slug:
 *                 type: string
 *                 example: "learn-javascript"
 *               category:
 *                 type: string
 *                 example: "64f1e7c2d3a4b5c6d7e8f9a0"
 *               instructor:
 *                 type: string
 *                 example: "64f1e7c2d3a4b5c6d7e8f9b1"
 *               price:
 *                 type: number
 *                 example: 100
 *               isFree:
 *                 type: boolean
 *                 example: false
 *             required:
 *               - title
 *               - slug
 *               - category
 *               - instructor
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Invalid input
 */
// Only instructors or admins can create courses
courseRoute.post(
  "/courses",
  authenticate,
  authoriz("instructor", "admin"),
  courseCtrl.addCourse
);

/**
 * @openapi
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64f1e7c2d3a4b5c6d7e8f9d3"
 *                   title:
 *                     type: string
 *                     example: "Learn JavaScript"
 *                   slug:
 *                     type: string
 *                     example: "learn-javascript"
 *                   category:
 *                     type: string
 *                     example: "64f1e7c2d3a4b5c6d7e8f9a0"
 *                   instructor:
 *                     type: string
 *                     example: "64f1e7c2d3a4b5c6d7e8f9b1"
 *                   price:
 *                     type: number
 *                     example: 100
 *                   isFree:
 *                     type: boolean
 *                     example: false
 *                   published:
 *                     type: boolean
 *                     example: true
 */
courseRoute.get("/courses", courseCtrl.getAllCourses);

/**
 * @openapi
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64f1e7c2d3a4b5c6d7e8f9d3"
 *                 title:
 *                   type: string
 *                   example: "Learn JavaScript"
 *                 slug:
 *                   type: string
 *                   example: "learn-javascript"
 *                 category:
 *                   type: string
 *                   example: "64f1e7c2d3a4b5c6d7e8f9a0"
 *                 instructor:
 *                   type: string
 *                   example: "64f1e7c2d3a4b5c6d7e8f9b1"
 *                 price:
 *                   type: number
 *                   example: 100
 *                 isFree:
 *                   type: boolean
 *                   example: false
 *                 published:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Course not found
 */
courseRoute.get("/courses/:id", courseCtrl.getCourseById);

//get courses by instructor id
/**
 * @openapi
 * /instructorCourses/{id}:
 *   get:
 *     summary: Get courses by instructor ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the instructor
 *     responses:
 *       200:
 *         description: List of courses by instructor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64f1e7c2d3a4b5c6d7e8f9d3"
 *                   title:
 *                     type: string
 *                     example: "Learn JavaScript"
 *                   slug:
 *                     type: string
 *                     example: "learn-javascript"
 *                   category:
 *                     type: string
 *                     example: "64f1e7c2d3a4b5c6d7e8f9a0"
 *                   instructor:
 *                     type: string
 *                     example: "64f1e7c2d3a4b5c6d7e8f9b1"
 *                   price:
 *                     type: number
 *                     example: 100
 *                   isFree:
 *                     type: boolean
 *                     example: false
 *                   published:
 *                     type: boolean
 *                     example: true
 *       404:
 *         description: Instructor not found
 */
courseRoute.get("/instructorCourses/:id", courseCtrl.getCoursesByInstructorId);

/**
 * @openapi
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to delete
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
// Only instructors or admins can delete courses
courseRoute.delete(
  "/courses/:id",
  authenticate,
  authoriz("instructor", "admin"),
  courseCtrl.deleteCourse
);

/**
 * @openapi
 * /courses/{id}:
 *   patch:
 *     summary: Update a course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Learn Advanced JavaScript"
 *               slug:
 *                 type: string
 *                 example: "learn-advanced-javascript"
 *               price:
 *                 type: number
 *                 example: 120
 *               isFree:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Course not found
 */
// Only instructors or admins can update courses
courseRoute.patch(
  "/courses/:id",
  authenticate,
  authoriz("instructor", "admin"),
  courseCtrl.updateCourse
);

module.exports = courseRoute;
