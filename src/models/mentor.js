const mongoose = require ("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, "First Name is required"] },
    lastName: { type: String, required: [true, "Last Name is required"] },
    students: { type: Array },
  },
  {
    collection: "mentor",
    versionKey: false,
  }
);

const mentorModel = mongoose.model("mentor", mentorSchema);

module.exports = mentorSchema;