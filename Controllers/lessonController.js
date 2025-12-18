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

    // course.lessons.push(lesson._id);
    // await course.save();
    res.status(201).json({
      success: true,
      message: "Lesson created successfully. Waiting for admin approval",
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
// Get all lessons with localization
const getAllLessons = async (req, res) => {
  try {
    const lang = req.query.lang || "en"; // اللغة المطلوبة

    const lessons = await Lesson.find().populate(
      "instructor",
      "name email profileImage"
    );

    // Localize response
    const localizedLessons = lessons.map((lesson) => ({
      _id: lesson._id,
      course: lesson.course,
      title: lesson.title[lang],
      content: lesson.content[lang],
      type: lesson.type,
      instructor: lesson.instructor,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      order: lesson.order,
      isPreview: lesson.isPreview,
      isApproved: lesson.isApproved,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    }));

    res.status(200).json({
      success: true,
      count: localizedLessons.length,
      data: localizedLessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lessons",
      error: error.message,
    });
  }
};

//-----------get Lesson by id with localization------------
const getLessonById = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const isEdit = req.query.edit === "true";
    const lessonId = req.params.id;

    const lesson = await Lesson.findById(lessonId).populate(
      "instructor",
      "name email profileImage"
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: lang === "ar" ? "الدرس غير موجود" : "Lesson not found",
      });
    }

    if (isEdit) {
      res.status(200).json({
        success: true,
        data: lesson, //
      });
    } else {
      console.log("👁️ Returning localized lesson data for viewing");
      const localizedLesson = {
        _id: lesson._id,
        course: lesson.course,
        title: getTextByLang(lesson.title, lang),
        content: getTextByLang(lesson.content, lang),
        type: lesson.type,
        instructor: lesson.instructor,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        order: lesson.order,
        isPreview: lesson.isPreview,
        isApproved: lesson.isApproved,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
      };

      res.status(200).json({
        success: true,
        data: localizedLesson,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        req.query.lang === "ar" ? "فشل في جلب الدرس" : "Failed to fetch lesson",
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
const getLessonsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lessons = await Lesson.find({ course: courseId }).populate(
      "course",
      "title"
    );

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lessons for this course",
      error: error.message,
    });
  }
};
const getLessonByInstructorId = async (req, res) => {
  try {
    const lessons = await Lesson.find({
      instructor: req.params.insId,
    }).populate("instructor", "name email profileImage");
    console.log("INS ID =", req.params.insId);

    res
      .status(200)
      .json(lessons.length > 0 ? lessons : { message: "No courses found" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occurred while retrieving courses" });
  }
};

// -------------------------approved lesson by admin------------------------
const approveLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson)
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });

    //-----------------only admin can approve lessons------------------
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admin allowed" });
    }

    // -----------if lesson is already approved-------------
    if (lesson.isApproved)
      return res
        .status(400)
        .json({ success: false, message: "Lesson already approved" });

    // -----------update lesson approval status-------------
    lesson.isApproved = true;
    await lesson.save();

    // -----------add lesson to course-------------
    const course = await Course.findById(lesson.course);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    if (!course.lessons.some((id) => id.toString() === lesson._id.toString())) {
      course.lessons.push(lesson._id);
      await course.save();
    }

    res.status(200).json({
      success: true,
      message: "Lesson approved and added to course successfully",
      data: lesson,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------get pending lessons for admin------------------
const getPendingLessons = async (req, res) => {
  try {
    //-----------------only admin can view pending lessons------------------
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can view pending lessons",
      });
    }

    const pendingLessons = await Lesson.find({ isApproved: false })
      .populate("instructor", "name email profileImage")
      .populate("course", "title");

    res.status(200).json({
      success: true,
      count: pendingLessons.length,
      data: pendingLessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending lessons",
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
  getLessonsByCourseId,
  getLessonByInstructorId,
  approveLesson,
  getPendingLessons,
};
