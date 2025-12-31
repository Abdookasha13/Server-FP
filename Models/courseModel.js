const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      en: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 100,
        required: true,
      },
      ar: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 100,
        required: true,
      },
    },
    slug: {
      en: { type: String, required: true, unique: true },
      ar: { type: String, required: true, unique: true },
    },
    shortDescription: {
      en: { type: String, maxlength: 200 },
      ar: { type: String, maxlength: 200 },
    },
    description: {
      en: { type: String, minlength: 20 },
      ar: { type: String, minlength: 20 },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          if (value === undefined || value === null || value === "")
            return true;
          if (this.price === undefined || this.price === null) return true;
          return value < this.price;
        },
        message: "Discount price must be less than the original price",
      },
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    // tags: {
    //   en: [{ type: String }],
    //   ar: [{ type: String }],
    // },
    thumbnailUrl: {
      type: String,
      match: /^https?:\/\/.+/,
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    studentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    published: {
      type: Boolean,
      default: false,
    },
  skillLevel: {
  type: String,
  enum: ["Beginner", "Intermediate", "Advanced","All Levels"],
  default: "Beginner",
}
  },
  { timestamps: true }
);

courseSchema.virtual("lessonsCount").get(function () {
  return this.lessons?.length || 0;
});

courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Course", courseSchema);
