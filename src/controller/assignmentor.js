const mentorModel = require ("../models/mentor.js");
const studentModel = require ("../models/student.js");

const AddMentor = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    // Create a new mentor
    const newMentor = new mentorModel({
      firstName,
      lastName,
    });
    await newMentor.save();

    res
      .status(201)
      .send({ message: "Mentor created successfully", mentor: newMentor });
  } catch (error) {
    res.send({ message: "Internal server error", error: error.message });
  }
};

const AddStudent = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    // Create a new student
    const newStudent = new studentModel({
      firstName,
      lastName,
    });

    await newStudent.save();

    res
      .status(201)
      .send({ message: "Student created successfully", student: newStudent });
  } catch (error) {
    res.send({ message: "Internal server error", error: error.message });
  }
};

const Assignstudent = async (req, res) => {
  try {
    const { mentorFirstName, studentFirstNames } = req.body;

    // Find mentor by first name
    const mentor = await mentorModel.findOne({ firstName: mentorFirstName });

    if (!mentor) {
      return res.status(404).send({ message: "Mentor not found" });
    }
    const StudentsWithoutMentor = await studentModel.find({ mentor: "" });
    // Ensure studentFirstNames is an array
    if (!Array.isArray(studentFirstNames)) {
      return res
        .status(400)
        .send({ message: "Invalid studentFirstNames format" });
    }

    const studentsToAdd = await studentModel.find({
      firstName: { $in: studentFirstNames },
      $or: [{ mentor: "" }],
    });

    if (studentsToAdd.length !== 0) {
      mentor.students = Array.from(
        new Set([
          ...mentor.students,
          ...studentsToAdd.map((student) => student.firstName),
        ])
      );

      // Assign the mentor to selected students
      for (const student of studentsToAdd) {
        student.mentor = mentor.firstName;
        await student.save();
      }

      await mentor.save();

      // Find students without a mentor (updated list)
      const updatedStudentsWithoutMentor = await studentModel.find({
        mentor: "",
      });

      res.status(200).send({
        message: `Students assigned to the mentor ${mentor.firstName} successfully`,
        studentlist: mentor.students,
        studentsWithoutMentor: updatedStudentsWithoutMentor,
      });
    } else {
      res.send({
        message: "All selected students are already assigned to a mentor",
        studentsWithoutMentor: StudentsWithoutMentor,
      });
    }
    // Update mentor's students array
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const UpdateMentorForStudent = async (req, res) => {
  try {
    const { mentorFirstName, studentFirstName } = req.body;

    if (!Array.isArray(studentFirstName)) {
      return res
        .status(400)
        .send({ message: "Invalid studentFirstNames format" });
    }

    // Find student by first name
    const student = await studentModel.findOne({ firstName: studentFirstName });

    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    // Find mentor by first name
    const mentor = await mentorModel.findOne({ firstName: mentorFirstName });

    if (!mentor) {
      return res.status(404).send({ message: "Mentor not found" });
    }

    // If the student already has a mentor, update the previous mentor field
    if (student.mentor) {
      student.previousMentor = student.mentor;
    }

    //remove the student from the old mentor's list
    if (student.mentor) {
      const oldMentor = await mentorModel.findOne({
        firstName: student.mentor,
      });

      if (oldMentor) {
        oldMentor.students = oldMentor.students.filter(
          (name) => name !== student.firstName
        );
        await oldMentor.save();
      }
    }

    student.mentor = mentor.firstName;
    await student.save();

    mentor.students = Array.from(
      new Set([...mentor.students, student.firstName])
    );
    await mentor.save();

    res.status(200).send({
      message: "Mentor updated for the student successfully",
      mentor: mentor,
      student: student,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const AllStudentsForMentor = async (req, res) => {
  try {
    const { mentorFirstName } = req.body;

    const mentor = await mentorModel.findOne({ firstName: mentorFirstName });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.status(200).json({
      message: `Students for the mentor ${mentor.firstName} retrieved successfully`,
      StudentsList: mentor.students,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const PreviousMentorForStudent = async (req, res) => {
  try {
    const { studentFirstName } = req.body;
    const student = await studentModel.findOne({ firstName: studentFirstName });
    if (student) {
      if (student.previousMentor.length === 0) {
        res.send({
          message: `No Previous mentor for ${student.firstName}`,
          currentMentor: student.mentor,
        });
      } else {
        res.send({
          message: `Previous mentor for ${student.firstName} is retrived successfully`,
          previousMentor: student.previousMentor,
        });
      }
    } else {
      res.send({
        message: `student ${student.firstName} does not exist`,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  AddMentor,
  AddStudent,
  Assignstudent,
  UpdateMentorForStudent,
  AllStudentsForMentor,
  PreviousMentorForStudent,
};