const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  eventImage: {
    type: String,
    required: [true, "Event image is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
});

module.exports = mongoose.model("Event", serviceSchema);
