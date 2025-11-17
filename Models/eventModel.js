const mongoose = require("mongoose");

// Event schema (renamed from serviceSchema for clarity)
const eventSchema = new mongoose.Schema(
  {
    eventImage: {
      type: String,
      required: [true, "Event image is required"],
      trim: true,
    },
    title: {
      en: { type: String, required: [true, "Title (EN) is required"], trim: true },
      ar: { type: String, required: [true, "Title (AR) is required"], trim: true },
    },
    description: {
      en: { type: String, required: [true, "Description (EN) is required"], trim: true },
      ar: { type: String, required: [true, "Description (AR) is required"], trim: true },
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true,
    },
    startTime: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    endTime: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    location: {
      en: { type: String, required: [true, "Location (EN) is required"], trim: true },
      ar: { type: String, required: [true, "Location (AR) is required"], trim: true },
    },
  },
  {
    timestamps: true, // Adds createdAt / updatedAt so controller responses match
  }
);

module.exports = mongoose.model("Event", eventSchema);
