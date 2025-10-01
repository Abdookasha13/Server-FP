const Enrollment = require("../Models/enrollmentModel");

//--------- Create enrollment ------------
const createEnrollment = async (req, res) => {
  try {
    const { user, course } = req.body;

    if (!user || !course) {
      return res.status(400).json({ message: "User and Course are required" });
    }

    const exist = await Enrollment.findOne({ user, course });
    if (exist) {
      return res.status(409).json({ message: "User already enrolled in this course" });
    }

    const enrollment = new Enrollment({ user, course });
    await enrollment.save();

    res.status(201).json({
      message: "Enrollment created successfully",
      enrollment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during enrollment creation" });
  }
};

const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "title description")
      .populate("progress.lesson", "title");
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching enrollments" });
  }
};

const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("user", "name email")
      .populate("course", "title description")
      .populate("progress.lesson", "title");

    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: "Error fetching enrollment" });
  }
};

const updateEnrollment = async (req, res) => {
  try {
    const updates = { ...req.body };

    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    })
      .populate("user", "name email")
      .populate("course", "title description")
      .populate("progress.lesson", "title");

    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    res.json({ message: "Enrollment updated successfully", enrollment });
  } catch (err) {
    res.status(500).json({ message: "Error updating enrollment" });
  }
};

const deleteEnrollmentById = async (req, res) => {
  try {
    const deleted = await Enrollment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Enrollment not found" });
    res.json({ message: "Enrollment deleted successfully" });
  } catch (err) {
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
