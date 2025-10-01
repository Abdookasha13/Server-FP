const Lesson = require("../Models/lessonModel");

// إضافة درس جديد إلى قاعدة البيانات
// POST /addLesson
const createLesson = async (req, res) => {
  try {
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

// جلب جميع الدروس من قاعدة البيانات
// GET /getAllLessons
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

// جلب درس واحد باستخدام الـ ID
// GET /getLesson/:id
const getLessonById = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);

    // التحقق من وجود الدرس
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

// حذف درس من قاعدة البيانات باستخدام الـ ID
// DELETE /deleteLesson/:id
const deleteLessonById = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findByIdAndDelete(lessonId);

    // التحقق من وجود الدرس
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete lesson",
      error: error.message,
    });
  }
};

// تحديث بيانات درس موجود باستخدام الـ ID
// PUT /updateLesson/:id
const updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findByIdAndUpdate(lessonId, req.body, {
      new: true,
      runValidators: true,
    });

    // التحقق من وجود الدرس
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: lesson,
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
