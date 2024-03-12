const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, "First Name is required"] },
    lastName: { type: String, required: [true, "Last Name is required"] },
    mentor: { type: String, default: "" },
    previousMentor: { type: String, default: "" },
  },
  {
    collection: "student",
    versionKey: false,
  }
);

const studentModel = mongoose.model("student", studentSchema);
module.exports = studentSchema; 