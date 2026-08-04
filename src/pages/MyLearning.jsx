import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiPlayCircle } from "react-icons/fi";
import { getUserEnrolledCourses } from "../services/operations/profileAPI";
import Spinner from "../components/common/Spinner";

const statusStyles = {
  "Not Started": "bg-richblack-700 text-richblack-100",
  "In Progress": "bg-yellow-50 text-richblack-900",
  Completed: "bg-caribbeangreen-50 text-richblack-5",
};

function MyLearning() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserEnrolledCourses(token);
        setCourses(data || []);
      } catch (error) {
        toast.error(error.message || "Could not load your learning");
      }
      setLoading(false);
    })();
  }, [token]);

  if (loading) {
    return <Spinner />;
  }

  if (user?.accountType !== "Student") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-10 text-center">
        <p className="text-lg font-semibold text-richblack-5">
          My Learning is only for students
        </p>
        <Link
          to="/dashboard/my-courses"
          className="rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 hover:bg-yellow-25"
        >
          Go to My Courses
        </Link>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-10 text-center">
        <p className="text-lg font-semibold text-richblack-5">
          You have not started learning yet
        </p>
        <p className="text-sm text-richblack-300">
          Enroll in a course and it will show up here with your progress.
        </p>
        <Link
          to="/catalog"
          className="rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 hover:bg-yellow-25"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-richblack-5">
        My Learning
      </h1>
      <p className="mb-6 text-sm text-richblack-300">
        Keep going — pick up any course where you left off.
      </p>

      <div className="space-y-4">
        {courses.map((course) => {
          const progress = course.progress || {
            completedVideos: 0,
            totalVideos: 0,
            percent: 0,
            status: "Not Started",
          };

          return (
            <div
              key={course._id}
              className="group flex flex-col gap-4 overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 p-4 transition-all duration-300 hover:border-richblack-500 hover:shadow-lg hover:shadow-black/40 sm:flex-row sm:items-center"
            >
              <Link
                to={`/view-course/${course._id}`}
                className="block shrink-0 overflow-hidden rounded-lg"
              >
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="aspect-video w-full object-cover transition-all duration-300 group-hover:scale-105 sm:w-48"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold leading-snug text-richblack-5">
                    {course.courseName}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      statusStyles[progress.status] || statusStyles["Not Started"]
                    }`}
                  >
                    {progress.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-richblack-700">
                    <div
                      className="h-full rounded-full bg-yellow-50 transition-all duration-500"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-xs font-medium text-richblack-200">
                    {progress.percent}%
                  </span>
                </div>

                <p className="text-xs text-richblack-300">
                  {progress.completedVideos} of {progress.totalVideos} lectures
                  completed
                </p>

                <Link
                  to={`/view-course/${course._id}`}
                  className="mt-1 inline-flex w-fit items-center gap-2 rounded-md bg-yellow-50 px-4 py-1.5 text-sm font-semibold text-richblack-900 hover:bg-yellow-25"
                >
                  <FiPlayCircle className="text-lg" />
                  {progress.percent > 0 ? "Continue Learning" : "Start Course"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyLearning;
