
// Import required modules
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mentor_student_db',)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

// Define Mentor schema
const mentorSchema = new mongoose.Schema({
  Name: String,
  Studentsname:String,
  Languang:String,
  Class:String,
  Exp:String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

// Define Student schema
const studentSchema = new mongoose.Schema({
  Name: String,
  DOB : String,
  DOJ: String,
  Mentorname: String,
  BatchNo: String,
  Languang:String,
  Class:String,


  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' }
});

// Create Mentor model
const Mentor = mongoose.model('Mentor', mentorSchema);

// Create Student model
const Student = mongoose.model('Student', studentSchema);
const EventsRouter =require("express").Router();

// API to create a Mentor
EventsRouter.post('/mentors', async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(200).json(mentor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Mentor' });
  }
});

// API to create a Student
EventsRouter.post('/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Student' });
  }
});

// API to assign a Student to a Mentor
EventsRouter.post('/mentors/:mentorId/students/:studentId', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId);
    const student = await Student.findById(req.params.studentId);

    if (!mentor || !student) {
      return res.status(404).json({ error: 'Mentor or Student not found' });
    }

    mentor.students.push(student);
    student.mentor = mentor;
    await mentor.save();
    await student.save();

    res.status(200).json({ message: 'Student assigned to Mentor successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign Student to Mentor' });
  }
});

// API to get all Students for a particular Mentor
EventsRouter.get('/mentors/:mentorId/students', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId).populate('students');
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.status(200).json(mentor.students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Students for Mentor' });
  }
});

// API to get the previously assigned Mentor for a particular Student
EventsRouter.get('/students/:studentId/mentor', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate('mentor');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student.mentor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Mentor for Student' });
  }
});

module.exports = EventsRouter;

