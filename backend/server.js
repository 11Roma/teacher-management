const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const teacherRoutes = require("./routes/teacherRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRequestRoutes = require("./routes/leaveRequestRoutes");
const authRoutes = require("./routes/authRoutes");


app.use("/api/leave-requests", leaveRequestRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("Teacher Management API is Running!");
});

// Connect Database and Start Server
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();