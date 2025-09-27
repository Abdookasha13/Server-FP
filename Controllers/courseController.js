const Course = require("../Models/courseModel");

//add new course
const addCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
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

//get all courses

const getAllCourses = async (req, res) => {
  try {
    const course = await Course.find();
    res
      .status(200)
      .json(course.length > 0 ? course : { message: "No courses found" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occurred while retrieving courses" });
  }
};

//get course by id

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send("Course not found");
    }
    res.status(200).json(course);
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the course" });
  }
};

//delete course by id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).send("Course not found");
    }
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
    Object.entries(req.body).filter(([key]) => !blockedFields.includes(key))
  );

  const ignoredFields = Object.keys(req.body).filter((key) =>
    blockedFields.includes(key)
  );
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).send("Course not found");
    }
    res.status(200).json({
      message: "Course updated successfully!",

      ignoredFields: ignoredFields.length > 0 ? ignoredFields : undefined,
      course,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occurred while updating the course" });
  }
};

module.exports = {
  addCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  updateCourse,
};
