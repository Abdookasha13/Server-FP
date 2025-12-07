const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "article", "quiz"],
      default: "video",
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
    videoUrl: String,
    duration: Number,
    order: Number,
    isPreview: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Lesson", LessonSchema);
