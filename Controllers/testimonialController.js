const Testimonial = require("../Models/testimonialModel");

// ---------add new testimonial---------
const addTestimonial = async (req, res) => {
  try {
    //-------only authenticated users can add testimonials-----------
    if (!req.user) {
      return res.status(403).json({ message: "Forbidden" });
    }
    //-----------ensure userId is set from the authenticated user-----------
    const data = { ...req.body, userId: req.user.id };
    const testimonial = new Testimonial(data);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Failed to add testimonial", error });
  }
};

//---------getAllTestimonials---------
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().populate(
      "userId",
      "name role profileImage"
    );
    res
      .status(200)
      .json(
        testimonials.length > 0
          ? testimonials
          : { message: "No testimonials found" }
      );
  } catch (error) {
    res.status(500).json({ message: "Failed to get testimonials", error });
  }
};

//----------get testimonial by id---------
const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id).populate(
      "userId",
      "name role profileImage"
    );
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Failed to get testimonial", error });
  }
};

//--------update testimonial---------
const updateTestimonial = async (req, res) => {
  try {
    if (
      req.user &&
      req.user.role !== "admin" &&
      req.user.id !== req.params.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updates = { ...req.body };
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res
      .status(200)
      .json({ message: "Testimonial updated successfully", testimonial });
  } catch (error) {
    res.status(500).json({ message: "Failed to update testimonial", error });
  }
};

//--------delete testimonial---------
const deleteTestimonial = async (req, res) => {
  try {
    if (
      req.user &&
      req.user.role !== "admin" &&
      req.user.id !== req.params.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete testimonial", error });
  }
};

module.exports = {
  addTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};
