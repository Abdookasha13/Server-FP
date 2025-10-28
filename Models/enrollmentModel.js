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
    certificateUrl: String,
  },
  { timestamps: true }
);

EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
