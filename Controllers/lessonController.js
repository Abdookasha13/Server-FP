const Lesson = require("../Models/lessonModel");
const Course = require("../Models/courseModel");

// add Lesson
const createLesson = async (req, res) => {
  try {
    // Only instructors or admins can add lessons. Additionally, only the
    // instructor who owns the course (or admin) may add lessons to that course.
    if (
      !req.user ||
      (req.user.role !== "instructor" && req.user.role !== "admin")
    ) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { course: courseId } = req.body;
    if (!courseId)
      return res
        .status(400)
        .json({ success: false, message: "Course id is required" });

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: lesson,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create lesson",
      error: error.message,
    });
  }
};

//-------get AllLessons----------
const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lessons",
      error: error.message,
    });
  }
};

//-----------get Lesson by id------------
const getLessonById = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lesson",
      error: error.message,
    });
  }
};

//--------delete Lesson by id-------------
const deleteLessonById = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson)
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });

    const course = await Course.findById(lesson.course);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Parent course not found" });

    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await Lesson.findByIdAndDelete(lessonId);
    res
      .status(200)
      .json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete lesson",
      error: error.message,
    });
  }
};

//--------------update Lesson by id------------
const updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson)
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });

    const course = await Course.findById(lesson.course);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Parent course not found" });

    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updated = await Lesson.findByIdAndUpdate(lessonId, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update lesson",
      error: error.message,
    });
  }
};

module.exports = {
  createLesson,
  getAllLessons,
  getLessonById,
  deleteLessonById,
  updateLesson,
};
