import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiTrash2, FiHeart } from "react-icons/fi";
import {
  getWishlist,
  removeCourseFromWishlist,
} from "../services/operations/wishlistAPI";
import Spinner from "../components/common/Spinner";

function Wishlist() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getWishlist(token, dispatch);
        setCourses(data || []);
      } catch (error) {
        toast.error(error.message || "Could not load wishlist");
      }
      setLoading(false);
    })();
  }, [token, dispatch]);

  const handleRemove = async (courseId) => {
    try {
      await removeCourseFromWishlist(token, courseId, dispatch);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error.message || "Could not remove course");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-richblack-700 bg-richblack-800 p-10 text-center">
        <FiHeart className="text-4xl text-richblack-300" />
        <p className="text-lg font-semibold text-richblack-5">
          Your wishlist is empty
        </p>
        <p className="text-sm text-richblack-300">
          Save courses you like for later and buy them anytime.
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
        Wishlist
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course._id}
            className="overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800"
          >
            <Link to={`/course/${course._id}`}>
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="aspect-video w-full object-cover"
              />
            </Link>
            <div className="space-y-3 p-4">
              <Link to={`/course/${course._id}`}>
                <p className="text-sm font-semibold text-richblack-5 line-clamp-1 hover:text-yellow-50">
                  {course.courseName}
                </p>
              </Link>
              <p className="text-xs text-richblack-300">
                {course.instructor?.firstName} {course.instructor?.lastName}
              </p>
              <p className="text-sm font-medium text-richblack-200">
                ₹{course.price}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/checkout/${course._id}`)}
                  className="flex-1 rounded-md bg-yellow-50 py-2 text-sm font-semibold text-richblack-900 hover:bg-yellow-25"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => handleRemove(course._id)}
                  title="Remove from wishlist"
                  className="flex items-center justify-center rounded-md border border-richblack-600 px-3 text-richblack-200 hover:border-pink-500 hover:text-pink-500"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;

