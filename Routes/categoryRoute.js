const express = require("express");
const categoryRoute = express.Router();
const categoryController = require("../Controllers/categoryController");
const authenticate = require("../middleware/authenticationMiddleware");
const authoriz = require("../middleware/authorizationMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated id of the category
 *         name:
 *           type: string
 *           description: Name of the category
 *         slug:
 *           type: string
 *           description: URL-friendly slug
 *         description:
 *           type: string
 *           description: Description of the category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date of creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date of last update
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
categoryRoute.get("/category", categoryController.getAllCategories);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
categoryRoute.get("/category/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
// Only instructors or admins can create categories
categoryRoute.post(
  "/category",
  authenticate,
  authoriz("instructor", "admin"),
  categoryController.createCategory
);

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
// Only instructors or admins can update categories
categoryRoute.put(
  "/category/:id",
  authenticate,
  authoriz("instructor", "admin"),
  categoryController.updateCategory
);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
// Only instructors or admins can delete categories
categoryRoute.delete(
  "/category/:id",
  authenticate,
  authoriz("instructor", "admin"),
  categoryController.deleteCategory
);

module.exports = categoryRoute;
