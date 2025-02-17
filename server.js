// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Routine = require('models/Routine');
const Request = require('models/Request');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.log('MongoDB connection error:', err));

// Model for Routine (simplified example)
const routineSchema = new mongoose.Schema({
  day: String,
  classTest: {
    subject: String,
    teacher: String,
    room: String,
  },
  morningSlots: [{
    subject: String,
    teacher: String,
    room: String,
  }],
  midDaySlots: [{
    isLab: Boolean,
    subject: String,
    teacher: String,
    room: String,
    startTime: String,
    endTime: String,
  }],
  afternoonSlots: [{
    isLab: Boolean,
    subject: String,
    teacher: String,
    room: String,
    startTime: String,
    endTime: String,
  }],
});

// Routine Model
const RoutineModel = mongoose.model('Routine', routineSchema);

// Model for Request (simplified example)
const requestSchema = new mongoose.Schema({
  teacherName: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

// Request Model
const RequestModel = mongoose.model('Request', requestSchema);

// Routes
app.get('/routine', async (req, res) => {
  try {
    const routines = await RoutineModel.find();
    res.json(routines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/routine', async (req, res) => {
  const { day, classTest, morningSlots, midDaySlots, afternoonSlots } = req.body;

  const newRoutine = new RoutineModel({
    day,
    classTest,
    morningSlots,
    midDaySlots,
    afternoonSlots,
  });

  try {
    await newRoutine.save();
    res.status(201).json({ message: 'Routine added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/request', async (req, res) => {
  const { teacherName, content } = req.body;

  const newRequest = new RequestModel({
    teacherName,
    content,
  });

  try {
    await newRequest.save();
    res.status(201).json({ message: 'Request added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/requests', async (req, res) => {
  try {
    const requests = await RequestModel.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
