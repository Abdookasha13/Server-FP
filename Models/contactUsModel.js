const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^(010|011|012|015)\d{8}$/, "Please fill a valid phone number"],
    },
    subject: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
    },
    message: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactUs", contactUsSchema);
