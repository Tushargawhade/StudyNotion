import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { FiArrowRight, FiClock, FiPlayCircle, FiVideo } from "react-icons/fi";
import { getUserEnrolledCourses } from "../services/operations/profileAPI";
import Spinner from "../components/common/Spinner";
import GetAvgRating from "../utils/avgRating";
import { convertSecondsToDuration } from "../utils/secToDuration";

function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserEnrolledCourses(token);
        setCourses(data || []);
      } catch (error) {
        toast.error(error.message || "Could not load enrolled courses");
      }
      setLoading(false);
    })();
  }, [token]);

  if (loading) {
    return <Spinner />;
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-richblack-700 bg-richblack-800 p-10 text-center">
        <p className="text-lg font-semibold text-richblack-5">
          You are not enrolled in any course yet
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
      <h1 className="mb-6 text-2xl font-semibold text-richblack-5">
        Enrolled Courses
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const avgRating = GetAvgRating(course.ratingAndReviews);
          const lectureCount = course.courseContent?.reduce(
            (acc, s) => acc + (s.subSection?.length || 0),
            0
          );
          const totalDuration = course.courseContent?.reduce(
            (acc, s) =>
              acc +
              s.subSection?.reduce(
                (a, l) => a + parseInt(l.timeDuration || 0, 10),
                0
              ),
            0
          );
          const instructorName = course.instructor
            ? `${course.instructor.firstName} ${course.instructor.lastName}`
            : null;

          return (
            <div
              key={course._id}
              className="group flex flex-col overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 transition-all duration-300 hover:-translate-y-1 hover:border-richblack-500 hover:shadow-lg hover:shadow-black/40"
            >
              <div className="relative overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="aspect-video w-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                {course.category?.name && (
                  <span className="absolute left-2.5 top-2.5 rounded-md bg-[#0F1B33]/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                    {course.category.name}
                  </span>
                )}
                <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 text-[10px] font-semibold text-richblack-900">
                  <FiPlayCircle className="text-xs" />
                  Enrolled
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="min-h-[2.5rem] text-sm font-semibold leading-snug text-richblack-5 line-clamp-2">
                  {course.courseName}
                </h3>

                {instructorName && (
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        course.instructor?.image ||
                        `https://api.dicebear.com/5.x/initials/svg?seed=${instructorName}`
                      }
                      alt={instructorName}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <p className="text-xs text-richblack-300">
                      {instructorName}
                    </p>
                  </div>
                )}

                <div className="mt-auto space-y-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <FaStar className="shrink-0 text-yellow-50" />
                    <span className="font-semibold text-richblack-25">
                      {avgRating > 0 ? avgRating.toFixed(1) : "New"}
                    </span>
                    <span className="text-richblack-300">
                      ({course.ratingAndReviews?.length || 0} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-richblack-300">
                    <span className="flex items-center gap-1.5">
                      <FiVideo className="text-sm text-richblack-200" />
                      {lectureCount} lectures
                    </span>
                    {totalDuration > 0 && (
                      <span className="flex items-center gap-1.5">
                        <FiClock className="text-sm text-richblack-200" />
                        {convertSecondsToDuration(totalDuration)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 border-t border-richblack-700 pt-3">
                  <Link
                    to={`/view-course/${course._id}`}
                    className="flex items-center justify-center gap-2 rounded-md bg-yellow-50 py-2 text-sm font-semibold text-richblack-900 hover:bg-yellow-25"
                  >
                    <FiPlayCircle className="text-lg" />
                    Continue Learning
                  </Link>
                  <Link
                    to={`/course/${course._id}`}
                    className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-richblack-200 hover:text-yellow-50"
                  >
                    Course Details
                    <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EnrolledCourses;
