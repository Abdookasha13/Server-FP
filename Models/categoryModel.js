const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    parent: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Category", CategorySchema);
