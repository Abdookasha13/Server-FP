const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
  },
 title: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
});

module.exports = mongoose.model("Service", serviceSchema);
