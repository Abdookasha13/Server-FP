const mongoose = require("mongoose");
const Enrollment = require("../Models/enrollmentModel");
const courseModel = require("../Models/courseModel");
const reviewsModel = require("../Models/reviewsModel");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createEnrollment = async (req, res) => {
  try {
    //------only authenticated students may create enrollments for themselves--------
    //------the authentication middleware sets req.user (id + role)------------------
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "student")
      return res.status(403).json({ message: "Only students can enroll" });

    const { course } = req.body;
    const user = req.user.id;
    if (!course) return res.status(400).json({ message: "Course is required" });
    if (!isValidId(user) || !isValidId(course))
      return res.status(400).json({ message: "Invalid user or course id" });

    const enrollment = new Enrollment({ user, course });
    await enrollment.save();
   await courseModel.findByIdAndUpdate(course, { $inc: { studentsCount: 1 } });

    const populated = await Enrollment.findById(enrollment._id)
      .populate("user", "name email")
      .populate("course", "title description")
      .populate("progress.lesson", "title");

    res.status(201).json({
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
          return res.status(400).json({
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
const getEnrollmentsByStdIdId = async (req, res) => {
  try {
    const { stdId } = req.params;

    // جيب الـ enrollments
    const enrollments = await Enrollment.find({ user: stdId }).populate({
      path: "course",
      select: "title price thumbnailUrl instructor",
      populate: {
        path: "instructor",
        select: "name profileImage",
      },
    });

    // لكل enrollment، جيب التقييم بتاعه
    const enrollmentsWithRatings = await Promise.all(
      enrollments.map(async (enrollment) => {
        const review = await reviewsModel.findOne({
          course: enrollment.course._id,
          user: stdId,
        });

        const enrollmentObj = enrollment.toObject();
        return {
          ...enrollmentObj,
          rating: review?.rating || null, // أضيف التقييم لو موجود
        };
      })
    );

    res.status(200).json(
      enrollmentsWithRatings.length > 0
        ? enrollmentsWithRatings
        : { message: "No courses found" }
    );
  } catch (err) {
    console.error("getEnrollmentsByStdIdId error:", err);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving courses" });
  }
};
const updateProgressLesson = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { enrollmentId } = req.params;
    const { lessonId } = req.body;

    if (!isValidId(enrollmentId) || !isValidId(lessonId)) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // تأكد أنه الطالب نفسه اللي بيحدّث
    if (enrollment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // جيب الـ course عشان نعرف كم lesson فيها
    const course = await courseModel.findById(enrollment.course).populate("lessons");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const totalLessons = course.lessons.length;
    if (totalLessons === 0) {
      return res.status(400).json({ message: "Course has no lessons" });
    }

    // شوف الـ lesson موجود في الـ progress أم لا
    const lessonProgress = enrollment.progress.find(
      (p) => p.lesson.toString() === lessonId
    );

    if (!lessonProgress) {
      enrollment.progress.push({
        lesson: lessonId,
        completed: true,
        completedAt: new Date(),
      });
    } else {
      lessonProgress.completed = true;
      lessonProgress.completedAt = new Date();
    }

    // احسب الـ progress percentage
    const completedLessons = enrollment.progress.filter(
      (p) => p.completed
    ).length;
    enrollment.progressPercentage = Math.round(
      (completedLessons / totalLessons) * 100
    );

    // لو اكتمل الـ course، حدّث الـ status
    if (enrollment.progressPercentage === 100) {
      enrollment.status = "completed";
      enrollment.completedDate = new Date();
    }

    await enrollment.save();

    const updated = await Enrollment.findById(enrollmentId)
      .populate("user", "name email")
      .populate("course", "title description")
      .populate("progress.lesson", "title");

    res.status(200).json({
      message: "Progress updated successfully",
      enrollment: updated,
    });
  } catch (err) {
    console.error("updateProgressLesson error:", err);
    res.status(500).json({ message: "Error updating progress" });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const enrollments = await Enrollment.find({
      user: req.user.id,
      status: "in_progress",
    })
      .populate({
        path: "course",
        select: "title description thumbnailUrl instructor duration",
        populate: {
          path: "instructor",
          select: "name profileImage",
        },
      })
      .populate("progress.lesson", "title");

    res.status(200).json(enrollments);
  } catch (err) {
    console.error("getEnrolledCourses error:", err);
    res.status(500).json({ message: "Error fetching enrolled courses" });
  }
};

const getCompletedCourses = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const enrollments = await Enrollment.find({
      user: req.user.id,
      status: "completed",
    })
      .populate({
        path: "course",
        select: "title description thumbnailUrl instructor",
        populate: {
          path: "instructor",
          select: "name profileImage",
        },
      })
      .sort({ completedDate: -1 });

    res.status(200).json(enrollments);
  } catch (err) {
    console.error("getCompletedCourses error:", err);
    res.status(500).json({ message: "Error fetching completed courses" });
  }
};

const getStudentStats = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const enrollments = await Enrollment.find({ user: req.user.id });

    const stats = {
      totalEnrolled: enrollments.length,
      completed: enrollments.filter((e) => e.status === "completed").length,
      inProgress: enrollments.filter((e) => e.status === "in_progress").length,
      certificates: enrollments.filter((e) => e.certificateUrl).length,
      avgProgress: enrollments.length > 0 
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.progressPercentage, 0) /
              enrollments.length
          )
        : 0,
    };

    res.status(200).json(stats);
  } catch (err) {
    console.error("getStudentStats error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

module.exports = {
  createEnrollment, 
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollmentById,
  getEnrollmentsByStdIdId ,
  updateProgressLesson,
  getEnrolledCourses,
  getCompletedCourses,
  getStudentStats,
};
