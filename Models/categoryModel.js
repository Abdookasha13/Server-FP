const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    icon: { type: String, trim: true },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

CategorySchema.virtual("coursesCount").get(function () {
  return this.courses?.length || 0;
});

CategorySchema.set("toJSON", { virtuals: true });
CategorySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Category", CategorySchema);
