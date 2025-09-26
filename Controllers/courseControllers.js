const Course = require("../Models/courseModel");

//----------------add course--------
const addCourse = async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json(course);
};
