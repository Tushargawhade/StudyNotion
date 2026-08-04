import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiCheckCircle, FiLock, FiPlayCircle } from "react-icons/fi";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { enrollCourse } from "../services/operations/studentFeaturesAPI";
import { getUserDetails } from "../services/operations/profileAPI";
import { setUser } from "../slices/profileSlice";
import Spinner from "../components/common/Spinner";

function Checkout() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  const isEnrolled = user?.courses?.includes(courseId);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCourseDetails(courseId);
        setCourse(data.courseDetails);
      } catch (error) {
        toast.error(error.message || "Could not load course");
        navigate("/");
      }
      setLoading(false);
    })();
  }, [courseId, navigate]);

  useEffect(() => {
    if (!loading && course && isEnrolled) {
      navigate(`/view-course/${courseId}`);
    }
  }, [loading, course, isEnrolled, courseId, navigate]);

  const handleBuyNow = async () => {
    setBuying(true);
    try {
      await enrollCourse(token, courseId);
      const updatedUser = await getUserDetails(token);
      dispatch(setUser(updatedUser));
      toast.success("Course purchased successfully");
      navigate(`/view-course/${courseId}`);
    } catch (error) {
      toast.error(error.message || "Could not complete purchase");
    }
    setBuying(false);
  };

  if (loading) {
    return <Spinner />;
  }

  if (!course) {
    return null;
  }

  return (
    <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-8 py-10 lg:flex-row">
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-richblack-5">
            Checkout
          </h1>
          <p className="mt-1 text-sm text-richblack-300">
            Complete your purchase to start learning instantly.
          </p>
        </div>

        <div className="space-y-5 rounded-xl border border-richblack-700 bg-richblack-800 p-6">
          <h2 className="text-lg font-semibold text-richblack-5">
            Billing Details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-richblack-200">
                Full Name
              </label>
              <input
                readOnly
                value={`${user?.firstName} ${user?.lastName}`}
                className="w-full rounded-md bg-richblack-700 p-3 text-sm text-richblack-5 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-richblack-200">
                Email
              </label>
              <input
                readOnly
                value={user?.email}
                className="w-full rounded-md bg-richblack-700 p-3 text-sm text-richblack-5 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 rounded-xl border border-richblack-700 bg-richblack-800 p-6">
          <h2 className="text-lg font-semibold text-richblack-5">
            Payment Method
          </h2>
          <div className="flex items-center gap-3 rounded-md border border-richblack-600 p-4">
            <FiCheckCircle className="text-xl text-yellow-50" />
            <div>
              <p className="text-sm font-medium text-richblack-5">
                No payment required (Demo)
              </p>
              <p className="text-xs text-richblack-300">
                Payments are not enabled yet. You will be enrolled instantly for
                free and can pay later once payments go live.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-[35%]">
        <div className="space-y-4 rounded-xl border border-richblack-700 bg-richblack-800 p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-richblack-5">
            Order Summary
          </h2>
          <div className="flex items-center gap-4">
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="h-16 w-24 rounded-md object-cover"
            />
            <div>
              <p className="text-sm font-medium text-richblack-5">
                {course.courseName}
              </p>
              <p className="text-xs text-richblack-300">
                {course.instructor?.firstName} {course.instructor?.lastName}
              </p>
            </div>
          </div>

          <div className="space-y-2 border-t border-richblack-700 pt-4 text-sm text-richblack-200">
            <div className="flex justify-between">
              <span>Course Price</span>
              <span>₹{course.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-400">- ₹{course.price}</span>
            </div>
            <div className="flex justify-between border-t border-richblack-700 pt-3 text-base font-semibold text-richblack-5">
              <span>Total</span>
              <span>₹0</span>
            </div>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={buying}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-yellow-50 py-2.5 font-semibold text-richblack-900 hover:bg-yellow-25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiLock />
            {buying ? "Processing..." : "Buy Now"}
          </button>

          <Link
            to={`/course/${courseId}`}
            className="flex items-center justify-center gap-2 rounded-md border border-richblack-600 py-2.5 text-sm font-medium text-richblack-200 hover:border-yellow-50 hover:text-yellow-50"
          >
            <FiPlayCircle />
            Back to Course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
