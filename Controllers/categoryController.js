const Category = require("../Models/categoryModel");

// جلب كل الكاتيجوريز
getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب كاتيجوري واحدة بالـ ID
getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// إنشاء كاتيجوري جديد
createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const newCategory = new Category({ name, slug, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تحديث كاتيجوري
updateCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, description },
      { new: true, runValidators: true }
    );
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
