const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: String,
    description: String,
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, default: 0 },
    discountPrice: Number,
    isFree: { type: Boolean, default: false },
    tags: [String],
    thumbnailUrl: String,
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
    studentsCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
