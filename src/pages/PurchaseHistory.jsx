import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiCheckCircle, FiClock, FiPlayCircle, FiShoppingBag } from "react-icons/fi";
import { getPurchaseHistory } from "../services/operations/studentFeaturesAPI";
import Spinner from "../components/common/Spinner";

function PurchaseHistory() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPurchaseHistory(token);
        setPurchases(data || []);
      } catch (error) {
        toast.error(error.message || "Could not load purchase history");
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
          Purchase history is only for students
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

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-10 text-center">
        <FiShoppingBag className="text-4xl text-richblack-300" />
        <p className="text-lg font-semibold text-richblack-5">
          No purchases yet
        </p>
        <p className="text-sm text-richblack-300">
          Courses you enroll in will appear here with their details.
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
        Purchase History
      </h1>
      <p className="mb-6 text-sm text-richblack-300">
        A record of all the courses you have enrolled in.
      </p>

      <div className="space-y-4">
        {purchases.map((purchase) => {
          const course = purchase.course || {};
          const date = purchase.createdAt
            ? new Date(purchase.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—";
          const isEnrolled = user?.courses?.includes(course._id);

          return (
            <div
              key={purchase._id}
              className="group flex flex-col gap-4 overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 p-4 transition-all duration-300 hover:border-richblack-500 hover:shadow-lg hover:shadow-black/40 sm:flex-row sm:items-center"
            >
              <Link
                to={`/course/${course._id}`}
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
                  <Link
                    to={`/course/${course._id}`}
                    className="text-sm font-semibold leading-snug text-richblack-5 hover:text-yellow-50"
                  >
                    {course.courseName}
                  </Link>
                  <span className="shrink-0 rounded-full bg-caribbeangreen-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-richblack-5">
                    {purchase.status || "Enrolled"}
                  </span>
                </div>

                <p className="text-xs text-richblack-300">
                  {course.instructor?.firstName} {course.instructor?.lastName}
                  {course.category?.name && ` · ${course.category.name}`}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-richblack-200">
                  <span className="flex items-center gap-1.5">
                    <FiCheckCircle className="text-yellow-50" />
                    ₹{course.price}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiClock className="text-yellow-50" />
                    Enrolled on {date}
                  </span>
                </div>

                <div className="mt-1 flex gap-3">
                  <Link
                    to={
                      isEnrolled
                        ? `/view-course/${course._id}`
                        : `/checkout/${course._id}`
                    }
                    className="inline-flex w-fit items-center gap-2 rounded-md bg-yellow-50 px-4 py-1.5 text-sm font-semibold text-richblack-900 hover:bg-yellow-25"
                  >
                    <FiPlayCircle className="text-lg" />
                    {isEnrolled ? "Go to Course" : "Enroll Now"}
                  </Link>
                  <Link
                    to={`/course/${course._id}`}
                    className="inline-flex w-fit items-center rounded-md border border-richblack-600 px-4 py-1.5 text-sm font-medium text-richblack-200 hover:border-yellow-50 hover:text-yellow-50"
                  >
                    View Details
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

export default PurchaseHistory;
