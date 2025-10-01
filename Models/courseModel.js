const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 100,
      required: true,
    },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, maxlength: 200 },
    description: { type: String, minlength: 20 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: { type: Number, default: 0, min: 0 },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "Discount price must be less than the original price",
      },
    },
    isFree: { type: Boolean, default: false },
    tags: [String],
    thumbnailUrl: { type: String, match: /^https?:\/\/.+/ },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    studentsCount: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
