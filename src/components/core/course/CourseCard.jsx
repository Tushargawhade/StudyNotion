import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaHeart, FaStar } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import GetAvgRating from "../../../utils/avgRating";
import {
  addCourseToWishlist,
  removeCourseFromWishlist,
} from "../../../services/operations/wishlistAPI";

function CourseCard({ course, className }) {
  const avgRating = GetAvgRating(course.ratingAndReviews);

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const isEnrolled = user?.courses?.includes(course._id);
  const isInWishlist = wishlist.includes(course._id);

  const showWishlistButton =
    token !== null &&
    user?.accountType === "Student" &&
    !isEnrolled;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isInWishlist) {
        await removeCourseFromWishlist(token, course._id, dispatch);
        toast.success("Removed from Save for Later");
      } else {
        await addCourseToWishlist(token, course._id, dispatch);
        toast.success("Course saved for later");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Link to={`/course/${course._id}`}>
      <div
        className={`group flex flex-col overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 transition-all duration-300 hover:-translate-y-1 hover:border-richblack-500 hover:shadow-lg hover:shadow-black/40 ${
          className || ""
        }`}
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
          {showWishlistButton && (
            <button
              onClick={handleWishlistToggle}
              title={isInWishlist ? "Remove from wishlist" : "Save for later"}
              className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#0F1B33]/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                isInWishlist
                  ? "text-pink-500"
                  : "text-white hover:text-pink-400"
              }`}
            >
              {isInWishlist ? (
                <FaHeart className="text-sm" />
              ) : (
                <FaHeart className="text-sm opacity-60" />
              )}
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="min-h-[2.5rem] text-sm font-semibold leading-snug text-richblack-5 line-clamp-2">
            {course.courseName}
          </h3>

          <div className="mt-auto flex items-center gap-1.5 text-xs">
            <FaStar className="shrink-0 text-yellow-50" />
            <span className="font-semibold text-richblack-25">
              {avgRating > 0 ? avgRating.toFixed(1) : "New"}
            </span>
            <span className="text-richblack-300">
              ({course.ratingAndReviews?.length || 0} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-richblack-300">
              <HiUsers className="text-sm text-richblack-200" />
              {course.studentsEnrolled?.length || 0} students
            </span>
            <p className="text-base font-bold text-richblack-5">
              ₹{course.price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
