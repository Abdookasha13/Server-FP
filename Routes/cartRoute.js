const express = require("express");
const cartRoute = express.Router();
const authenticate = require("../middleware/authenticationMiddleware");
const cartController = require("../Controllers/cartController");
const authoriz = require("../middleware/authorizationMiddleware");

cartRoute.get(
  "/cart",
  authenticate,
  authoriz("student"),
  cartController.getCart
);
cartRoute.post(
  "/cart/add",
  authenticate,
  authoriz("student"),
  cartController.addToCart
);
cartRoute.delete(
  "/cart/:courseId",
  authenticate,
  authoriz("student"),
  cartController.removeFromCart
);

module.exports = cartRoute;

module.exports = cartRoute;
