const Attendance = require("../models/Attendance");

const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("teacher", "name subject")
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAttendance = async (req, res) => {
  try {
    const record = await Attendance.create(req.body);

    const populatedRecord = await record.populate("teacher", "name subject");

    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAttendance,
  addAttendance,
};
