const LeaveRequest = require("../models/LeaveRequest");

const getLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find()
      .populate("teacher", "name subject")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addLeaveRequest = async (req, res) => {
  try {
    const request = await LeaveRequest.create(req.body);
    const populatedRequest = await request.populate(
      "teacher",
      "name subject"
    );

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateLeaveRequest = async (req, res) => {
  try {
    const request = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate("teacher", "name subject");

    if (!request) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getLeaveRequests,
  addLeaveRequest,
  updateLeaveRequest,
};