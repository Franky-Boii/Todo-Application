const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  type: String,
  studentName: String,
  zoomLink: String,
  price: Number,
  paid: Boolean,
  dueDate: Date,
  completed: {
    type: Boolean,
    default: false
  },
  notes: String
});

module.exports = mongoose.model("Task", TaskSchema);