const Course = require("../Models/courseModel");
require("../Models/categoryModel");
require("../Models/userModel");

// add new course
const addCourse = async (req, res) => {
  try {
    //-------only instructors or admins can add courses-----------
    if (
      !req.user ||
      (req.user.role !== "instructor" && req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    //-----------ensure instructor is set from the authenticated user-----------
    const data = { ...req.body, instructor: req.user.id };
    const course = new Course(data);
    await course.save();
    res.status(201).json({ message: "Course added successfully!", course });
  } catch (err) {
    if (err.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Failed to add course", error: err.message });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred while adding the course" });
    }
  }
};

//get all courses with localization
const getAllCourses = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const courses = await Course.find()
      .populate("category", "name slug")
      .populate("instructor", "name email profileImage")
      .populate("lessons", "title type content videoUrl duration order isPreview");

    const localized = courses.map((c) => localizeCourse(c, lang));

    res.status(200).json(localized.length > 0 ? localized : { message: "No courses found" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred while retrieving courses" });
  }
};
//Change Course document to localized version
const localizeCourse = (course, lang = "en") => {
  return {
    _id: course._id,
    title: course.title[lang],
    slug: course.slug[lang],
    shortDescription: course.shortDescription?.[lang],
    description: course.description?.[lang],
    category: course.category,
    instructor: course.instructor,
    price: course.price,
    discountPrice: course.discountPrice,
    isFree: course.isFree,
    tags: course.tags?.[lang] || [],
    thumbnailUrl: course.thumbnailUrl,
    lessons: course.lessons,
    studentsCount: course.studentsCount,
    published: course.published,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    lessonsCount: course.lessons?.length || 0,
  };
};

//get course by id with localization
const getCourseById = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const course = await Course.findById(req.params.id)
      .populate("category", "name slug")
      .populate("instructor", "name email profileImage expertise experience")
      .populate("lessons", "title type content videoUrl duration order isPreview");

    if (!course) return res.status(404).send("Course not found");

    const localized = localizeCourse(course, lang);

    res.status(200).json(localized);
  } catch (err) {
    res.status(500).json({ message: "An error occurred while retrieving the course" });
  }
};

//get course by instructor id with localization
const getCoursesByInstructorId = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const courses = await Course.find({ instructor: req.params.id })
      .populate("category", "name slug")
      .populate("instructor", "name email profileImage")
      .populate("lessons", "title type content videoUrl duration order isPreview");

    const localized = courses.map((c) => localizeCourse(c, lang));

    res.status(200).json(localized.length > 0 ? localized : { message: "No courses found" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred while retrieving courses" });
  }
};


//delete course by id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found");

    //------------only admin or the course owner (instructor) can delete------------
    if (!req.user) return res.status(401).send("Unauthorized");
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user.id
    ) {
      return res.status(403).send("Forbidden");
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).send("Course deleted successfully!");
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occurred while deleting the course" });
  }
};

//update course
const updateCourse = async (req, res) => {
  const blockedFields = [
    "rating",
    "ratingCount",
    "studentsCount",
    "instructor",
    "_id",
  ];
  const updates = Object.fromEntries(
    Object.entries(req.body)
      .filter(([key]) => !blockedFields.includes(key))
      .filter(([, value]) => value !== undefined && value !== null)
  );

  const ignoredFields = Object.keys(req.body).filter((key) =>
    blockedFields.includes(key)
  );
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found");

    // Only admin or the course owner can update
    if (!req.user) return res.status(401).send("Unauthorized");
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user.id
    ) {
      return res.status(403).send("Forbidden");
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: "Course updated successfully!",
      ignoredFields: ignoredFields.length > 0 ? ignoredFields : undefined,
      course: updated,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while updating the course",
    });
  }
};

module.exports = {
  addCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  updateCourse,
  getCoursesByInstructorId,
};
