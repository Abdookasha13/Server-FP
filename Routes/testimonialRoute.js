const express = require("express");
const testimonialRoute = express.Router();
const testimonialController = require("../Controllers/testimonialController");
const authenticate = require("../middleware/authenticationMiddleware");
const authorize = require("../middleware/authorizationMiddleware");

//---------add new testimonial---------
testimonialRoute.post(
  "/addTestimonial",
  authenticate,
  testimonialController.addTestimonial
);

//---------get all testimonials---------
testimonialRoute.get(
  "/getAllTestimonials",
  testimonialController.getAllTestimonials
);

//----------get testimonial by id---------
testimonialRoute.get(
  "/getTestimonialById/:id",
  testimonialController.getTestimonialById
);

//--------update testimonial---------
testimonialRoute.patch(
  "/updateTestimonial/:id",
  authenticate,
  authorize("admin ,instructor, student"),
  testimonialController.updateTestimonial
);

//--------delete testimonial---------
testimonialRoute.delete(
  "/deleteTestimonial/:id",
  authenticate,
  authorize("admin ,instructor, student"),
  testimonialController.deleteTestimonial
);

module.exports = testimonialRoute;
