import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import { MdClose } from "react-icons/md";
import {
  addRatingAndReview,
  updateReview,
} from "../../../services/operations/courseDetailsAPI";

function CourseReviewModal({
  courseId,
  courseName,
  setModalData,
  onSuccess,
  reviewId,
  initialRating,
  initialReview,
}) {
  const { token } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(initialRating || 0);
  const [review, setReview] = useState(initialReview || "");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(reviewId);

  const onSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }
    if (review.trim() === "") {
      toast.error("Please write a review");
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await updateReview(reviewId, rating, review, token);
      } else {
        await addRatingAndReview(courseId, rating, review, token);
      }
      if (onSuccess) {
        await onSuccess();
      }
      setModalData(null);
    } catch (error) {
      toast.error(error.message || "Could not save review");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[550px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-richblack-5">
            {isEdit ? "Update your review" : "Rate this course"}
          </p>
          <button
            onClick={() => setModalData(null)}
            className="text-2xl text-richblack-200 hover:text-richblack-5"
          >
            <MdClose />
          </button>
        </div>

        <p className="mt-3 text-sm text-richblack-200">{courseName}</p>

        <div className="mt-6 flex flex-col items-center gap-2">
          <ReactStars
            count={5}
            size={40}
            value={rating}
            edit={true}
            activeColor="#ffd33c"
            onChange={(value) => setRating(value)}
          />
          <p className="text-sm text-richblack-300">
            {rating > 0 ? `${rating} out of 5` : "Select a rating"}
          </p>
        </div>

        <textarea
          placeholder="Share your experience with this course..."
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="mt-6 w-full rounded-lg border border-richblack-600 bg-richblack-700 p-3 text-[14px] text-richblack-5 placeholder:text-richblack-400 outline-none focus:border-yellow-50"
        />

        <div className="mt-6 flex items-center justify-end gap-x-4">
          <button
            onClick={() => setModalData(null)}
            className="rounded-md bg-richblack-200 px-5 py-2 font-semibold text-richblack-900 hover:bg-richblack-100"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="rounded-md bg-yellow-50 px-5 py-2 font-semibold text-richblack-900 hover:bg-yellow-25"
          >
            {loading ? "Submitting..." : isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseReviewModal;
