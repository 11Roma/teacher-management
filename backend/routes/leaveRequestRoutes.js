const express = require("express");
const router = express.Router();

const {
  getLeaveRequests,
  addLeaveRequest,
  updateLeaveRequest,
} = require("../controllers/leaveRequestController");

router.get("/", getLeaveRequests);
router.post("/", addLeaveRequest);
router.put("/:id", updateLeaveRequest);

module.exports = router;