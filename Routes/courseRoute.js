const express = require("express");
const route = express.Router();
const courseCtrl = require("../Controllers/courseController");

route.post("/courses", courseCtrl.addCourse);
route.get("/courses", courseCtrl.getAllCourses);
route.get("/courses/:id", courseCtrl.getCourseById);
route.delete("/courses/:id", courseCtrl.deleteCourse);
route.put("/courses/:id", courseCtrl.updateCourse);

module.exports = route;
