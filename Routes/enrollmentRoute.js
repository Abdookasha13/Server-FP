const express = require("express");
const enrollmentRoute = express.Router();
const enrollmentController = require("../Controllers/enrollmentController");
const authenticate = require("../middleware/authenticationMiddleware");
/**
 * @openapi
 * /enrollments/addEnrollment:
 *   post:
 *     summary: Enroll a user in a course (requires token)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Enrollment created
 *       401:
 *         description: Unauthorized (No token provided)
 */
enrollmentRoute.post(
  "/addEnrollment",
  authenticate,
  enrollmentController.createEnrollment
);

/**
 * @openapi
 * /enrollments/getAllEnrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollment]
 *     responses:
 *       200:
 *         description: List of all enrollments
 */
enrollmentRoute.get(
  "/getAllEnrollments",
  enrollmentController.getAllEnrollments
);

/**
 * @openapi
 * /enrollments/getEnrollment/{id}:
 *   get:
 *     summary: Get an enrollment by ID
 *     tags: [Enrollment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment object
 *       404:
 *         description: Enrollment not found
 */
enrollmentRoute.get(
  "/getEnrollment/:id",
  enrollmentController.getEnrollmentById
);

/**
 * @openapi
 * /enrollments/updateEnrollment/{id}:
 *   patch:
 *     summary: Update enrollment (requires token)
 *     tags: [Enrollment]
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
 *         description: Enrollment updated successfully
 *       404:
 *         description: Enrollment not found
 */
enrollmentRoute.patch(
  "/updateEnrollment/:id",
  authenticate,
  enrollmentController.updateEnrollment
);

/**
 * @openapi
 * /enrollments/deleteEnrollment/{id}:
 *   delete:
 *     summary: Delete an enrollment by ID (requires token)
 *     tags: [Enrollment]
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
 *         description: Enrollment deleted
 *       404:
 *         description: Enrollment not found
 */
enrollmentRoute.delete(
  "/deleteEnrollment/:id",
  authenticate,
  enrollmentController.deleteEnrollmentById
);

module.exports = enrollmentRoute;
