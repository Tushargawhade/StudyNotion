import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { deleteReview } from "../services/operations/courseDetailsAPI";
import { getWishlist } from "../services/operations/wishlistAPI";
import CourseAccordion from "../components/core/course/CourseAccordion";
import CourseDetailsCard from "../components/core/course/CourseDetailsCard";
import CourseReviewModal from "../components/core/course/CourseReviewModal";
import Spinner from "../components/common/Spinner";
import RatingStars from "../components/common/RatingStars";
import GetAvgRating from "../utils/avgRating";

function CourseDetails() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [totalDuration, setTotalDuration] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const loadCourse = async (showSpinner = true) => {
    if (showSpinner) {
      setLoading(true);
    }
    try {
      const data = await fetchCourseDetails(courseId);
      setCourse(data.courseDetails);
      setTotalDuration(data.totalDuration || "");
    } catch (error) {
      toast.error(error.message || "Could not load course");
    }
    if (showSpinner) {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    if (token && user?.accountType === "Student") {
      getWishlist(token, dispatch).catch(() => {});
    }
  }, [token, user, dispatch]);

  if (loading) {
    return <Spinner />;
  }

  if (!course) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-lg font-semibold text-richblack-200">
          Course not found
        </p>
      </div>
    );
  }

  const isEnrolled = user?.courses?.includes(courseId);
  const avgRating = GetAvgRating(course.ratingAndReviews);
  const alreadyReviewed = course.ratingAndReviews?.some(
    (r) => r.user === user?._id
  );

  const instructorName = course.instructor
    ? `${course.instructor.firstName} ${course.instructor.lastName}`
    : null;

  const lectureCount = course.courseContent?.reduce(
    (acc, s) => acc + (s.subSection?.length || 0),
    0
  );

  const lastUpdated = course.createdAt
    ? new Date(course.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const handleBuyCourse = () => {
    if (isEnrolled) {
      navigate(`/view-course/${courseId}`);
      return;
    }
    if (!token) {
      toast.error("Please login to enroll in this course");
      navigate("/login");
      return;
    }
    navigate(`/checkout/${courseId}`);
  };

  const handleEditReview = (review) => {
    setReviewModal({
      reviewId: review._id,
      rating: review.rating,
      review: review.review || "",
    });
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(deleteModal._id, token);
      await loadCourse(false);
    } catch (error) {
      toast.error(error.message || "Could not delete review");
    }
    setDeleteModal(null);
  };

  return (
    <div>
      <div className="border-b border-richblack-700 bg-gradient-to-b from-richblack-800 to-richblack-900 py-8">
        <div className="mx-auto w-11/12 max-w-maxContent">
          <p className="text-xs font-medium text-richblack-300">
            Home /{" "}
            <span className="text-richblack-100">
              {course.category?.name || "Catalog"}
            </span>{" "}
            / <span className="text-yellow-50">{course.courseName}</span>
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-richblack-5 md:text-4xl">
            {course.courseName}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-richblack-200">
            {course.courseDescription}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="flex items-center gap-1 font-semibold text-yellow-100">
              <FaStar className="text-yellow-50" />
              {avgRating > 0 ? avgRating.toFixed(1) : "New"}
            </span>
            <span className="text-richblack-300">
              ({course.ratingAndReviews?.length || 0} reviews)
            </span>
            <span className="flex items-center gap-1.5 text-richblack-200">
              <HiUsers className="text-richblack-100" />
              {course.studentsEnrolled?.length || 0} students
            </span>
            {course.category?.name && (
              <span className="rounded-full bg-richblack-700 px-3 py-1 text-xs font-medium text-yellow-50">
                {course.category.name}
              </span>
            )}
            {lastUpdated && (
              <span className="text-richblack-300">
                Last updated {lastUpdated}
              </span>
            )}
          </div>

          {instructorName && (
            <p className="mt-3 text-sm text-richblack-300">
              Created by{" "}
              <span className="font-medium text-yellow-50">
                {instructorName}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto w-11/12 max-w-maxContent py-8">
        <div className="lg:grid lg:grid-cols-[1fr_22rem] lg:gap-10">
          <aside className="lg:sticky lg:top-24 lg:order-2 lg:self-start">
            <CourseDetailsCard
              course={course}
              handleBuyCourse={handleBuyCourse}
            />
          </aside>

          <div className="mt-8 space-y-8 lg:order-1 lg:mt-0">
            <section className="rounded-xl border border-richblack-700 bg-richblack-800 p-6">
              <h2 className="text-xl font-semibold text-richblack-5">
                What you'll learn
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {course.whatYouWillLearn
                  ?.split("\n")
                  .filter((line) => line.trim())
                  .map((line, idx) => (
                    <p
                      key={idx}
                      className="flex items-start gap-2 text-sm leading-6 text-richblack-200"
                    >
                      <FaCheckCircle className="mt-1 shrink-0 text-yellow-50" />
                      <span>{line}</span>
                    </p>
                  ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold text-richblack-5">
                  Course Content
                </h2>
                <p className="text-xs text-richblack-300">
                  {course.courseContent?.length || 0} sections • {lectureCount}{" "}
                  lectures
                  {totalDuration && (
                    <>
                      {" "}
                      • {totalDuration} total length
                    </>
                  )}
                </p>
              </div>
              <CourseAccordion course={course} />
            </section>

            {course.instructions?.length > 0 && (
              <section className="rounded-xl border border-richblack-700 bg-richblack-800 p-6">
                <h2 className="text-xl font-semibold text-richblack-5">
                  Course Instructions
                </h2>
                <ul className="mt-4 space-y-2">
                  {course.instructions.map((instruction, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm leading-6 text-richblack-200"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-50" />
                      {instruction}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {instructorName && (
              <section className="rounded-xl border border-richblack-700 bg-richblack-800 p-6">
                <h2 className="text-xl font-semibold text-richblack-5">
                  Instructor
                </h2>
                <div className="mt-4 flex items-start gap-4">
                  <img
                    src={
                      course.instructor?.image ||
                      `https://api.dicebear.com/5.x/initials/svg?seed=${instructorName}`
                    }
                    alt={instructorName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-base font-semibold text-richblack-5">
                      {instructorName}
                    </p>
                    {course.instructor?.additionalDetails?.about && (
                      <p className="mt-1 text-sm leading-6 text-richblack-200">
                        {course.instructor.additionalDetails.about}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-richblack-5">
                  Ratings & Reviews
                </h2>
                {isEnrolled && !alreadyReviewed && (
                  <button
                    onClick={() =>
                      setReviewModal({ reviewId: null, rating: 0, review: "" })
                    }
                    className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 hover:bg-yellow-25"
                  >
                    Add Review
                  </button>
                )}
              </div>

              {course.ratingAndReviews?.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {course.ratingAndReviews.map((review) => (
                    <div
                      key={review._id}
                      className="rounded-xl border border-richblack-700 bg-richblack-800 p-5"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            review.user?.image ||
                            `https://api.dicebear.com/5.x/initials/svg?seed=${review.user?.firstName || "User"}`
                          }
                          alt={review.user?.firstName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-richblack-5">
                            {review.user?.firstName} {review.user?.lastName}
                          </p>
                          <RatingStars Review_Count={[review]} Star_Size={12} />
                        </div>
                        {String(review.user?._id) === String(user?._id) && (
                          <div className="ml-auto flex items-center gap-2">
                            <button
                              onClick={() => handleEditReview(review)}
                              title="Edit review"
                              className="text-richblack-300 transition-colors hover:text-yellow-50"
                            >
                              <FiEdit3 size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteModal(review)}
                              title="Delete review"
                              className="text-richblack-300 transition-colors hover:text-pink-200"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-richblack-200">
                        {review.review}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm text-richblack-300">
                  No reviews yet. Be the first to review this course.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>

      {reviewModal && (
        <CourseReviewModal
          courseId={courseId}
          courseName={course.courseName}
          setModalData={setReviewModal}
          onSuccess={() => loadCourse(false)}
          reviewId={reviewModal.reviewId}
          initialRating={reviewModal.rating}
          initialReview={reviewModal.review}
        />
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-richblack-900/60 backdrop-blur-sm">
          <div className="w-11/12 max-w-md rounded-xl border border-richblack-700 bg-richblack-800 p-6">
            <p className="text-lg font-semibold text-richblack-5">
              Delete review?
            </p>
            <p className="mt-2 text-sm text-richblack-200">
              This will permanently remove your review for this course.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="rounded-md border border-richblack-700 bg-richblack-700 px-4 py-2 text-sm font-semibold text-richblack-100 hover:bg-richblack-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="rounded-md bg-pink-200 px-4 py-2 text-sm font-semibold text-pink-25 hover:bg-pink-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;
