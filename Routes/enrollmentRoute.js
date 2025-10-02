const express = require("express");
const enrollmentRoute = express.Router();
const enrollmentController = require("../Controllers/enrollmentController");
const authenticate = require("../middleware/authenticationMiddleware");

/**
 * @openapi
 * /enrollments:
 *   post:
 *     summary: Enroll a user in a course (requires token)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - course
 *             properties:
 *               user:
 *                 type: string
 *                 example: "64f1e7c2d3a4b5c6d7e8f9a0"
 *               course:
 *                 type: string
 *                 example: "64f1e7c2d3a4b5c6d7e8f9b1"
 *     responses:
 *       201:
 *         description: Enrollment created
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Already enrolled
 *       500:
 *         description: Server error
 */
enrollmentRoute.post(
  "/enrollments",
  authenticate,
  enrollmentController.createEnrollment
);

/**
 * @openapi
 * /enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollments]
 *     responses:
 *       200:
 *         description: List of enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       500:
 *         description: Server error
 */
enrollmentRoute.get("/enrollments", enrollmentController.getAllEnrollments);

/**
 * @openapi
 * /enrollments/{id}:
 *   get:
 *     summary: Get enrollment by id
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment object
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
enrollmentRoute.get("/enrollments/:id", enrollmentController.getEnrollmentById);

/**
 * @openapi
 * /enrollments/{id}:
 *   patch:
 *     summary: Update enrollment (requires token)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     lesson:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *               completed:
 *                 type: boolean
 *               certificateUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Enrollment updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
enrollmentRoute.patch(
  "/enrollments/:id",
  authenticate,
  enrollmentController.updateEnrollment
);

/**
 * @openapi
 * /enrollments/{id}:
 *   delete:
 *     summary: Delete enrollment (requires token)
 *     tags: [Enrollments]
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
 *         description: Deleted successfully
 *       400:
 *         description: Invalid id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
enrollmentRoute.delete(
  "/enrollments/:id",
  authenticate,
  enrollmentController.deleteEnrollmentById
);

module.exports = enrollmentRoute;
