const express = require("express");
const reviewRoute = express.Router();
const reviewController = require("../Controllers/reviewsController");
const authenticate = require("../middleware/authenticationMiddleware");


// Only authenticated users can add reviews
reviewRoute.post(
  "/addReview",
  authenticate,
  reviewController.addOrUpdateRating
);

//------- Get Course Rating Stats --------

reviewRoute.get(
  "/reviews/stats/:courseId",
  reviewController.getCourseRatingStats
);


module.exports = reviewRoute;
