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
        completedAt: Date,
      },
    ],
    completed: { type: Boolean, default: false },
    certificateUrl: String,
  },
  { timestamps: true }
);

// منع التسجيل المكرر على مستوى الـ DB
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
