// models/Routine.js
const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  day: { type: String, required: true },
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

module.exports = mongoose.model('Routine', routineSchema);
