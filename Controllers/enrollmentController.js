// Controllers/enrollmentController.js
const mongoose = require("mongoose");
const Enrollment = require("../Models/enrollmentModel");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createEnrollment = async (req, res) => {
  try {
    const { user, course } = req.body;
    if (!user || !course)
      return res.status(400).json({ message: "User and Course are required" });
    if (!isValidId(user) || !isValidId(course))
      return res.status(400).json({ message: "Invalid user or course id" });

    // نعتمد الـ unique index + catch لرمز 11000 لتجنب race conditions
    const enrollment = new Enrollment({ user, course });
    await enrollment.save();

    const populated = await Enrollment.findById(enrollment._id)
      .populate("user", "name email")
      .populate("course", "title description")
      .populate("progress.lesson", "title");

    res
      .status(201)
      .json({
        message: "Enrollment created successfully",
        enrollment: populated,
      });
  } catch (err) {
    console.error("createEnrollment error:", err);
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "User already enrolled in this course" });
    }
    res
      .status(500)
      .json({ message: "Server error during enrollment creation" });
  }
};

const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "title description")
      .populate("progress.lesson", "title");
    res.status(200).json(enrollments);
  } catch (err) {
    console.error("getAllEnrollments error:", err);
    res.status(500).json({ message: "Error fetching enrollments" });
  }
};

const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ message: "Invalid enrollment id" });

    const enrollment = await Enrollment.findById(id)
      .populate("user", "name email")
      .populate("course", "title description")
      .populate("progress.lesson", "title");

    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });
    res.status(200).json(enrollment);
  } catch (err) {
    console.error("getEnrollmentById error:", err);
    res.status(500).json({ message: "Error fetching enrollment" });
  }
};

const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ message: "Invalid enrollment id" });

    // اسمح بتحديث الحقول المحددة فقط
    const allowed = ["progress", "completed", "certificateUrl"];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }

    // تحقق من صحة الـ progress لو موجود
    if (updates.progress) {
      if (!Array.isArray(updates.progress))
        return res.status(400).json({ message: "progress must be an array" });
      for (const p of updates.progress) {
        if (!p.lesson || !isValidId(p.lesson))
          return res
            .status(400)
            .json({
              message: "Each progress item must have a valid lesson id",
            });
        // normalize completed flag
        p.completed = !!p.completed;
        if (p.completed && !p.completedAt) p.completedAt = new Date();
      }
    }

    const enrollment = await Enrollment.findByIdAndUpdate(id, updates, {
      new: true,
    })
      .populate("user", "name email")
      .populate("course", "title description")
      .populate("progress.lesson", "title");

    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });
    res
      .status(200)
      .json({ message: "Enrollment updated successfully", enrollment });
  } catch (err) {
    console.error("updateEnrollment error:", err);
    res.status(500).json({ message: "Error updating enrollment" });
  }
};

const deleteEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ message: "Invalid enrollment id" });

    const deleted = await Enrollment.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Enrollment not found" });
    res.status(200).json({ message: "Enrollment deleted successfully" });
  } catch (err) {
    console.error("deleteEnrollmentById error:", err);
    res.status(500).json({ message: "Error deleting enrollment" });
  }
};

module.exports = {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollmentById,
};
