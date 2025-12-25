const Category = require("../Models/categoryModel");
const Course = require("../Models/courseModel");

const localizeCategory = (category, lang = "en") => {
  return {
    _id: category._id,
    name: category.name,
    icon: category.icon,
    coursesCount: category.coursesCount,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};

// getAllCategories with localization
const getAllCategories = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const categories = await Category.find().populate("courses");

    const localized = categories.map((cat) => localizeCategory(cat, lang));

    res
      .status(200)
      .json(
        localized.length > 0 ? localized : { message: "No categories found" }
      );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getCategoryById with localization
const getCategoryById = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const category = await Category.findById(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json(localizeCategory(category, lang));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// إنشاء كاتيجوري جديد
createCategory = async (req, res) => {
  try {
    // Only instructors or admins can create categories
    if (
      !req.user ||
      (req.user.role !== "instructor" && req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, icon } = req.body;

    const newCategory = new Category({ name, icon });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تحديث كاتيجوري
updateCategory = async (req, res) => {
  try {
    // Only instructors or admins can update categories

    if (
      !req.user ||
      (req.user.role !== "instructor" && req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.icon) updates.icon = req.body.icon;

    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف كاتيجوري
deleteCategory = async (req, res) => {
  try {
    // Only instructors or admins can delete categories
    if (
      !req.user ||
      (req.user.role !== "instructor" && req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Prevent deletion if any course references this category
    const used = await Course.exists({ category: req.params.id });
    if (used)
      return res
        .status(400)
        .json({ message: "Cannot delete category in use by courses" });

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
