import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardList,
  Settings,
  LogOut,
  GraduationCap,
  Menu
} 
from "lucide-react";
import "./App.css";

const initialTeachers = [
  { id: 1, name: "Sarah Johnson", email: "sarah@gmail.com", subject: "Mathematics", phone: "0612345678" },
  { id: 2, name: "Michael Brown", email: "michael@gmail.com", subject: "Physics", phone: "0623456789" },
  { id: 3, name: "Emily Davis", email: "emily@gmail.com", subject: "English", phone: "0634567890" },
  { id: 4, name: "David Wilson", email: "david@gmail.com", subject: "Biology", phone: "0645678901" },
];
function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [teachers, setTeachers] = useState(initialTeachers);
  const [attendance, setAttendance] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTeacher, setLeaveTeacher] = useState("");
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");  
  const [isAuthenticated, setIsAuthenticated] = useState(
  !!localStorage.getItem("token")
);

const [authMode, setAuthMode] = useState("login");
const [authName, setAuthName] = useState("");
const [authEmail, setAuthEmail] = useState("");
const [authPassword, setAuthPassword] = useState("");
const [currentUser, setCurrentUser] = useState(
  JSON.parse(localStorage.getItem("user") || "null")
);

useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/teachers");
      const data = await response.json();

      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  fetchTeachers();
}, []);

useEffect(() => {
  const fetchAttendance = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/attendance");
      const data = await response.json();

      setAttendance(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  fetchAttendance();
}, []);

useEffect(() => {
  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/leave-requests"
      );

      const data = await response.json();
      setLeaveRequests(data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  fetchLeaveRequests();
}, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
  name: "",
  email: "",
  subject: "",
  phone: "",
});

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Teachers", icon: Users },
    { name: "Attendance", icon: CalendarCheck },
    { name: "Leave Requests", icon: ClipboardList },
  ];




const handleAddTeacher = async (e) => {
  e.preventDefault();

  
if (editingTeacherId !== null) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/teachers/${editingTeacherId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeacher),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update teacher");
    }

    const updatedTeacher = await response.json();

    setTeachers(
      teachers.map((teacher) =>
        teacher._id === editingTeacherId ? updatedTeacher : teacher
      )
    );
  } catch (error) {
    console.error("Error updating teacher:", error);
    alert("Could not update teacher. Please try again.");
    return;
  }
}
 else {
    try {
      const response = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeacher),
      });

      if (!response.ok) {
        throw new Error("Failed to add teacher");
      }

      const data = await response.json();
      setTeachers([...teachers, data]);
    } catch (error) {
      console.error("Error adding teacher:", error);
      alert("Could not save teacher. Please try again.");
      return;
    }
  }

  setNewTeacher({
    name: "",
    email: "",
    subject: "",
    phone: "",
  });

  setEditingTeacherId(null);
  setShowForm(false);
};

const handleAddAttendance = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacher: selectedTeacher,
        date: attendanceDate,
        status: attendanceStatus,
        checkIn: attendanceStatus === "Present" ? checkIn : null,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save attendance");
    }

    const data = await response.json();

    setAttendance([data, ...attendance]);

    setSelectedTeacher("");
    setAttendanceDate("");
    setAttendanceStatus("");
    setCheckIn("");

    alert("Attendance saved successfully!");
  } catch (error) {
    console.error("Error saving attendance:", error);
    alert("Could not save attendance. Please try again.");
  }
};

const handleAddLeaveRequest = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5000/api/leave-requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher: leaveTeacher,
          startDate: leaveStartDate,
          endDate: leaveEndDate,
          reason: leaveReason,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit leave request");
    }

    const data = await response.json();

    setLeaveRequests([data, ...leaveRequests]);

    setLeaveTeacher("");
    setLeaveStartDate("");
    setLeaveEndDate("");
    setLeaveReason("");

    alert("Leave request submitted successfully!");
  } catch (error) {
    console.error("Error submitting leave request:", error);
    alert("Could not submit leave request.");
  }
};

const handleUpdateLeaveStatus = async (id, status) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/leave-requests/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update leave request");
    }

    const updatedRequest = await response.json();

    setLeaveRequests((previousRequests) =>
      previousRequests.map((request) =>
        request._id === id ? updatedRequest : request
      )
    );
  } catch (error) {
    console.error("Error updating leave request:", error);
    alert("Could not update leave request.");
  }
};

const handleAuthSubmit = async (e) => {
  e.preventDefault();

  try {
    const endpoint =
  authMode === "login" ? "login" : "register";

    const body =
      authMode === "login"
        ? {
            email: authEmail,
            password: authPassword,
          }
        : {
            name: authName,
            email: authEmail,
            password: authPassword,
          };

    const response = await fetch(
  `http://localhost:5000/api/auth/${endpoint}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }
);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Authentication failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: data.name,
        email: data.email,
      })
    );

    setCurrentUser(data);
    setIsAuthenticated(true);
    setAuthPassword("");
    setAuthName("");
    setAuthEmail("");
    setActivePage("Dashboard");

  } catch (error) {
    alert(error.message);
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setIsAuthenticated(false);
  setCurrentUser(null);
  setAuthMode("login");
  setActivePage("Dashboard");
};

const today = new Date().toLocaleDateString("en-CA");

const todayAttendance = attendance.filter(
  (record) =>
    new Date(record.date).toLocaleDateString("en-CA") === today
);

const presentToday = todayAttendance.filter(
  (record) => record.status === "Present"
).length;

const absentToday = todayAttendance.filter(
  (record) => record.status === "Absent"
).length;

const pendingRequests = leaveRequests.filter(
  (request) => request.status === "Pending"
).length;

if (!isAuthenticated) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>
          {authMode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <p>
          {authMode === "login"
            ? "Sign in to your account"
            : "Create your account to get started"}
        </p>

        <form onSubmit={handleAuthSubmit}>
          {authMode === "register" && (
            <input
              type="text"
              placeholder="Full Name"
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (minimum 6 characters)"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            minLength="6"
            required
          />

          <button type="submit">
            {authMode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          {authMode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
          >
            {authMode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={25} />
          </div>
          <span>EduManage</span>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`menu-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => setActivePage(item.name)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="menu-item">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="menu-item" onClick={handleLogout}>
  <LogOut size={20} />
  <span>Logout</span>
</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>{activePage}</h2>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
          <button className="profile">
            <div className="avatar">AD</div>
            <div>
              <strong>Admin User</strong>
              <small>Administrator</small>
            </div>
          </button>
        </header>

       
<section className="page-content">
  <h1>{activePage}</h1>
  <p className="welcome-text">
    Manage your school activities in one place.
  </p>

  {activePage === "Dashboard" && (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon blue">
          <Users size={22} />
        </div>
        <p>Total Teachers</p>
        <h2>{teachers.length}</h2>
        <small>Registered teachers</small>
      </div>

      <div className="stat-card">
        <div className="stat-icon green">
          <CalendarCheck size={22} />
        </div>
        <p>Present Today</p>
        <h2>{presentToday}</h2>
        <small>Teachers present</small>
      </div>

      <div className="stat-card">
        <div className="stat-icon orange">
          <Users size={22} />
        </div>
        <p>Absent Today</p>
        <h2>{absentToday}</h2>
        <small>Teachers absent</small>
      </div>

      <div className="stat-card">
        <div className="stat-icon purple">
          <ClipboardList size={22} />
        </div>
        <p>Pending Requests</p>
        <h2>{pendingRequests}</h2>
        <small>Waiting for approval</small>
      </div>
    </div>
  )}

      {activePage === "Dashboard" && (
        <div className="attendance-section">
          <div className="section-heading">
            <div>
              <h3>Recent Attendance</h3>
              <p>Today's attendance overview</p>
            </div>
            <button onClick={() => setActivePage("Attendance")}>
              View All
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Subject</th>
                  <th>Check In</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
  {todayAttendance.slice(0, 4).map((record) => (
    <tr key={record._id}>
      <td>{record.teacher?.name || "Unknown"}</td>
      <td>{record.teacher?.subject || "-"}</td>
      <td>{record.checkIn || "—"}</td>
      <td>
        <span className={`status ${record.status.toLowerCase()}`}>
          {record.status}
        </span>
      </td>
    </tr>
  ))}

  {todayAttendance.length === 0 && (
    <tr>
      <td colSpan="4">No attendance records yet.</td>
    </tr>
  )}
</tbody>
            </table>
          </div>
        </div>
      )}

{activePage === "Teachers" && (
  <div className="teachers-section">
    
<div className="teachers-toolbar">
  <div>
    <h3>All Teachers</h3>
    <p>{teachers.length} teachers registered</p>
  </div>

  <div className="teacher-actions">
    <input
      type="text"
      placeholder="Search teachers..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <button
      className="add-teacher-btn"
      onClick={() => setShowForm(true)}
    >
      + Add Teacher
    </button>
  </div>
</div>


{showForm && (
  <div className="teacher-form-card">
    <h3>{editingTeacherId !== null ? "Edit Teacher" : "Add New Teacher"}</h3>

    <form onSubmit={handleAddTeacher}>
      <input
        type="text"
        placeholder="Full Name"
        value={newTeacher.name}
        onChange={(e) =>
          setNewTeacher({ ...newTeacher, name: e.target.value })
        }
        required
      />

      <input
        type="email"
        placeholder="Email Address"
        value={newTeacher.email}
        onChange={(e) =>
          setNewTeacher({ ...newTeacher, email: e.target.value })
        }
        required
      />

      <input
        type="text"
        placeholder="Subject"
        value={newTeacher.subject}
        onChange={(e) =>
          setNewTeacher({ ...newTeacher, subject: e.target.value })
        }
        required
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={newTeacher.phone}
        onChange={(e) =>
          setNewTeacher({ ...newTeacher, phone: e.target.value })
        }
        required
      />

      <div className="form-actions">
        <button type="button" onClick={() => setShowForm(false)}>
          Cancel
        </button>
        <button type="submit">
  {editingTeacherId !== null ? "Update Teacher" : "Save Teacher"}
</button>
      </div>
    </form>
  </div>
)}


    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Phone</th>
          </tr>
        </thead>

        <tbody>
          {teachers
            .filter((teacher) =>
              teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.subject}</td>
                
<td>{teacher.phone}</td>
<td>
  <div className="action-buttons">
    <button
      className="edit-btn"
      onClick={() => {
        setNewTeacher({
          name: teacher.name,
          email: teacher.email,
          subject: teacher.subject,
          phone: teacher.phone,
        });
        setEditingTeacherId(teacher._id);
        setShowForm(true);
      }}
    >
      Edit
    </button>

    <button
      className="delete-btn"
      
onClick={async () => {
  if (window.confirm("Are you sure you want to delete this teacher?")) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/teachers/${teacher._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }

      setTeachers(
        teachers.filter((t) => t._id !== teacher._id)
      );
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("Could not delete teacher. Please try again.");
    }
  }
}}

    >
      Delete
    </button>
  </div>
</td>

              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
)}


{activePage === "Attendance" && (
  <div className="attendance-section">
    <div className="section-heading">
      <div>
        <h3>Attendance Management</h3>
        <p>Track teachers' daily attendance</p>
      </div>
    </div>

    <div className="teacher-form-card">
      <h3>Mark Attendance</h3>

      <form onSubmit={handleAddAttendance}>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          required
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={attendanceDate}
          onChange={(e) => setAttendanceDate(e.target.value)}
          required
        />

        <select
          value={attendanceStatus}
          onChange={(e) => setAttendanceStatus(e.target.value)}
          required
        >
          <option value="">Select Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <input
          type="time"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          disabled={attendanceStatus === "Absent"}
        />

        <button type="submit">Save Attendance</button>
      </form>
    </div>

    <div className="table-container">
      <h3>Attendance Records</h3>

      <table>
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map((record) => (
            <tr key={record._id}>
              <td>{record.teacher?.name}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.checkIn || "-"}</td>
              <td>
  <span className={`status-badge ${record.status.toLowerCase()}`}>
    {record.status}
  </span>
</td>
            </tr>
          ))}

          {attendance.length === 0 && (
            <tr>
              <td colSpan="4">No attendance records yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}
{activePage === "Leave Requests" && (
  <div className="attendance-section">
    <div className="section-heading">
      <div>
        <h3>Leave Requests</h3>
        <p>Manage teachers' leave requests</p>
      </div>
    </div>

    <div className="teacher-form-card">
      <h3>Submit Leave Request</h3>

      <form onSubmit={handleAddLeaveRequest}>
        <select
          value={leaveTeacher}
          onChange={(e) => setLeaveTeacher(e.target.value)}
          required
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.name}
            </option>
          ))}
        </select>

        <div className="form-group">
  <label>Start Date</label>
  <input
    type="date"
    value={leaveStartDate}
    onChange={(e) => setLeaveStartDate(e.target.value)}
    required
  />
</div>

        <div className="form-group">
  <label>End Date</label>
  <input
    type="date"
    value={leaveEndDate}
    onChange={(e) => setLeaveEndDate(e.target.value)}
    min={leaveStartDate}
    required
  />
</div>

        <input
          type="text"
          placeholder="Reason for leave"
          value={leaveReason}
          onChange={(e) => setLeaveReason(e.target.value)}
          required
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>

    <div className="table-container">
      <h3>All Leave Requests</h3>

      <table>
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request._id}>
              <td>{request.teacher?.name || "Unknown"}</td>
              <td>{new Date(request.startDate).toLocaleDateString()}</td>
              <td>{new Date(request.endDate).toLocaleDateString()}</td>
              <td>{request.reason}</td>
              <td>
  <span className={`status-badge ${request.status.toLowerCase()}`}>
    {request.status}
  </span>

  {request.status === "Pending" && (
    <div className="leave-actions">
      <button
        type="button"
        onClick={() =>
          handleUpdateLeaveStatus(request._id, "Approved")
        }
      >
        Approve
      </button>

      <button
        type="button"
        onClick={() =>
          handleUpdateLeaveStatus(request._id, "Rejected")
        }
      >
        Reject
      </button>
    </div>
  )}
</td>
            </tr>
          ))}

          {leaveRequests.length === 0 && (
            <tr>
              <td colSpan="5">No leave requests yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

</section>

      </main>
    </div>
  );
}

export default App;
