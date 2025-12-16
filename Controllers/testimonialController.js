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
//---------getAllTestimonials with localization---------
const getAllTestimonials = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const testimonials = await Testimonial.find()
      .populate("userId", "name role profileImage")
      .lean();

    if (!testimonials || testimonials.length === 0) {
      return res.status(200).json([]);
    }

    const localizedTestimonials = testimonials.map((t) => ({
      _id: t._id,
      userId: t.userId,
      comment: t.comment?.[lang] || t.comment?.en,
      rating: t.rating,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    res.status(200).json(localizedTestimonials);
  } catch (error) {
    res.status(500).json({ message: "Failed to get testimonials", error });
  }
};



//----------get testimonial by id with localization---------
const getTestimonialById = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const testimonial = await Testimonial.findById(req.params.id)
      .populate("userId", "name role profileImage")
      .lean();

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    const localizedTestimonial = {
      _id: testimonial._id,
      userId: testimonial.userId,
      comment: testimonial.comment?.[lang] || testimonial.comment?.en,
      rating: testimonial.rating,
      createdAt: testimonial.createdAt,
      updatedAt: testimonial.updatedAt,
    };

    res.status(200).json(localizedTestimonial);
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
