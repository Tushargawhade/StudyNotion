import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FaHeart, FaShare, FaUserTie } from "react-icons/fa";
import { FiClock, FiHeart, FiLayers, FiVideo } from "react-icons/fi";
import { convertSecondsToDuration } from "../../../utils/secToDuration";
import {
  addCourseToWishlist,
  removeCourseFromWishlist,
} from "../../../services/operations/wishlistAPI";

function CourseDetailsCard({ course, handleBuyCourse }) {
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

  const handleWishlistToggle = async () => {
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

  const lectureCount = course.courseContent?.reduce(
    (acc, s) => acc + (s.subSection?.length || 0),
    0
  );
  const totalDuration = course.courseContent?.reduce(
    (acc, s) =>
      acc +
      s.subSection.reduce(
        (a, l) => a + parseInt(l.timeDuration || 0, 10),
        0
      ),
    0
  );

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-richblack-700 bg-richblack-800 p-6">
      <img
        src={course.thumbnail}
        alt={course.courseName}
        className="aspect-video w-full rounded-md object-cover"
      />

      <p className="text-3xl font-semibold text-richblack-5">
        ₹{course.price}
      </p>

      <button
        onClick={handleBuyCourse}
        className="w-full rounded-md bg-yellow-50 py-2.5 font-semibold text-richblack-900 hover:bg-yellow-25"
      >
        {isEnrolled ? "Go to Course" : "Enroll Now"}
      </button>

      {showWishlistButton && (
        <button
          onClick={handleWishlistToggle}
          className={`flex w-full items-center justify-center gap-2 rounded-md border py-2.5 font-medium transition-all ${
            isInWishlist
              ? "border-yellow-50 bg-yellow-50 text-richblack-900"
              : "border-richblack-600 text-richblack-200 hover:border-yellow-50 hover:text-yellow-50"
          }`}
        >
          {isInWishlist ? (
            <>
              <FaHeart />
              Saved for Later
            </>
          ) : (
            <>
              <FiHeart />
              Save for Later
            </>
          )}
        </button>
      )}

      <button
        onClick={handleShare}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-richblack-600 py-2.5 font-medium text-richblack-200 hover:border-yellow-50 hover:text-yellow-50"
      >
        <FaShare />
        Share
      </button>

      <div className="border-t border-richblack-700 pt-4">
        <p className="mb-3 text-sm font-semibold text-richblack-5">
          This course includes
        </p>
        <div className="space-y-2 text-sm text-richblack-200">
          <p className="flex items-center gap-2">
            <FiVideo className="text-yellow-50" /> {lectureCount} lectures
          </p>
          <p className="flex items-center gap-2">
            <FiClock className="text-yellow-50" />{" "}
            {convertSecondsToDuration(totalDuration)} of content
          </p>
          <p className="flex items-center gap-2">
            <FiLayers className="text-yellow-50" />{" "}
            {course.courseContent?.length || 0} sections
          </p>
        </div>
      </div>

      <div className="border-t border-richblack-700 pt-4">
        <p className="mb-3 text-sm font-semibold text-richblack-5">
          Created by
        </p>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-richblack-700 text-yellow-50">
            <FaUserTie />
          </span>
          <div>
            <p className="text-sm font-medium text-richblack-5">
              {course.instructor?.firstName} {course.instructor?.lastName}
            </p>
            <p className="text-xs text-richblack-300">
              {course.instructor?.additionalDetails?.about}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsCard;
