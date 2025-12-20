// Models/enrollmentModel.js
const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    progress: [
      {
        lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
        completed: { type: Boolean, default: false },
        completedAt: {
          type: Date,
          default: function () {
            return this.completed ? new Date() : undefined;
          },
        },
      },
    ],
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedDate: Date,
    certificateUrl: String,
  },
  { timestamps: true }
);

EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
