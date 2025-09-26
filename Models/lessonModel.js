const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "article", "quiz"],
      default: "video",
    },
    content: String,
    videoUrl: String,
    duration: Number,
    order: Number,
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Lesson", LessonSchema);
