import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Contact from "./pages/Contact";
import OpenRoute from "./components/core/auth/OpenRoute";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import MyCourses from "./pages/MyCourses";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="/update-password"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="my-profile" replace />} />
          <Route
            path="my-profile"
            element={<DashboardPlaceholder title="My Profile" />}
          />
          <Route
            path="settings"
            element={<DashboardPlaceholder title="Settings" />}
          />
          <Route
            path="instructor"
            element={<DashboardPlaceholder title="Instructor Dashboard" />}
          />
          <Route
            path="my-courses"
            element={<MyCourses />}
          />
          <Route
            path="add-course"
            element={<AddCourse />}
          />
          <Route
            path="edit-course/:courseId"
            element={<EditCourse />}
          />
          <Route
            path="enrolled-courses"
            element={<DashboardPlaceholder title="Enrolled Courses" />}
          />
          <Route
            path="purchase-history"
            element={<DashboardPlaceholder title="Purchase History" />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
