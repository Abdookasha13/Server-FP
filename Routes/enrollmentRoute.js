const express = require("express");
const enrollmentRoute = express.Router();
const enrollmentController = require("../Controllers/enrollmentController");

/**
 * @openapi
 * /enrollments:
 *   post:
 *     summary: Enroll a user in a course
 *     tags: [Enrollment]
 *     responses:
 *       201:
 *         description: Enrollment created
 */
enrollmentRoute.post("/", enrollmentController.createEnrollment);

//------- get all enrollments --------
/**
 * @openapi
 * /enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollment]
 *     responses:
 *       200:
 *         description: List of all enrollments
 */
enrollmentRoute.get("/", enrollmentController.getAllEnrollments);

//------- get enrollment by id --------
/**
 * @openapi
 * /enrollments/{id}:
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
enrollmentRoute.get("/:id", enrollmentController.getEnrollmentById);

//------- update enrollment --------
/**
 * @openapi
 * /enrollments/{id}:
 *   patch:
 *     summary: Update enrollment
 *     tags: [Enrollment]
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
enrollmentRoute.patch("/:id", enrollmentController.updateEnrollment);

//------- delete enrollment --------
/**
 * @openapi
 * /enrollments/{id}:
 *   delete:
 *     summary: Delete an enrollment by ID
 *     tags: [Enrollment]
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
enrollmentRoute.delete("/:id", enrollmentController.deleteEnrollmentById);


module.exports = enrollmentRoute;
