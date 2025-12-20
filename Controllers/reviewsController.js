const Review = require("../Models/reviewsModel");
const Course = require("../Models/courseModel");
const Enrollment = require("../Models/enrollmentModel");
const mongoose = require("mongoose");

//------- Add or Update Rating --------
exports.addOrUpdateRating = async (req, res) => {
  try {
    const { course, rating } = req.body;
    const user = req.user.id;

    if (!course || !rating) {
      return res.status(400).json({
        success: false,
        message: "Course ID and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const enrollment = await Enrollment.findOne({
      user: user,
      course: course,
    });
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You must enroll in the course first",
      });
    }

    let review = await Review.findOne({ course: course, user: user });

    if (review) {
      review.rating = rating;
      await review.save();
      return res.status(200).json({
        success: true,
        message: "Rating updated successfully",
        data: review,
      });
    } else {
      // إنشاء تقييم جديد
      review = new Review({
        course: course,
        user: user,
        rating,
      });
      await review.save();
      return res.status(201).json({
        success: true,
        message: "Rating added successfully",
        data: review,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//------- Get Course Rating Stats --------
exports.getCourseRatingStats = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const stats = await Review.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
          ratings: { $push: "$rating" },
        },
      },
    ]);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (stats.length > 0) {
      stats[0].ratings.forEach((r) => {
        distribution[r]++;
      });
    }

    res.status(200).json({
      success: true,
      data: {
        averageRating:
          stats.length > 0 ? parseFloat(stats[0].averageRating.toFixed(2)) : 0,
        totalRatings: stats.length > 0 ? stats[0].totalRatings : 0,
        distribution,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ------- Get My Reviews --------
exports.getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.find({ user: userId })
      .select("course rating");

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};