import "./App.css";
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "./services/operations/profileAPI";
import { logout } from "./services/operations/authAPI";
import { setUser } from "./slices/profileSlice";
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
import MyCourses from "./pages/MyCourses";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import SearchResults from "./pages/SearchResults";
import EnrolledCourses from "./pages/EnrolledCourses";
import MyLearning from "./pages/MyLearning";
import InstructorDashboard from "./pages/InstructorDashboard";
import MyProfile from "./pages/MyProfile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import PurchaseHistory from "./pages/PurchaseHistory";
import Footer from "./components/common/Footer";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageInstructors from "./pages/admin/ManageInstructors";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageCategories from "./pages/admin/ManageCategories";

function App() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    if (token && !user) {
      (async () => {
        try {
          const data = await getUserDetails(token);
          dispatch(setUser(data));
        } catch (error) {
          dispatch(logout(navigate));
        }
      })();
    }
  }, [token, user, dispatch, navigate]);

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
        <Route path="/about" element={<About />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:categoryId" element={<Catalog />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />

        <Route
          path="/checkout/:courseId"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />

        <Route
          path="/view-course/:courseId"
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        />

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
            element={<MyProfile />}
          />
          <Route
            path="settings"
            element={<Settings />}
          />
          <Route
            path="instructor"
            element={<InstructorDashboard />}
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
            element={<EnrolledCourses />}
          />
          <Route
            path="my-learning"
            element={<MyLearning />}
          />
          <Route
            path="wishlist"
            element={<Wishlist />}
          />
          <Route
            path="purchase-history"
            element={<PurchaseHistory />}
          />
          <Route
            path="admin"
            element={<AdminDashboard />}
          />
          <Route
            path="admin/instructors"
            element={<ManageInstructors />}
          />
          <Route
            path="admin/students"
            element={<ManageStudents />}
          />
          <Route
            path="admin/categories"
            element={<ManageCategories />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
