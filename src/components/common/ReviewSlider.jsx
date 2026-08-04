import React, { useEffect, useState } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { getAllRatings } from "../../services/operations/courseDetailsAPI";

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={
            star <= Math.round(rating)
              ? "text-yellow-50"
              : "text-richblack-600"
          }
          size={13}
        />
      ))}
    </div>
  );
}

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllRatings();
        const filtered = (data || []).filter(
          (review) => Number(review?.rating) >= 3
        );
        setReviews(filtered);
      } catch (error) {
        setReviews([]);
      }
    })();
  }, []);

  if (reviews.length === 0) {
    return null;
  }

  const marqueeItems = [...reviews, ...reviews];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="animate-marquee mt-4 flex w-max gap-4 hover:[animation-play-state:paused]">
        {marqueeItems.map((review, i) => (
          <div
            key={`${review?._id || i}-${i}`}
            className="flex w-[270px] shrink-0 flex-col gap-2.5 rounded-xl border border-richblack-700 bg-gradient-to-b from-richblack-800 to-richblack-900 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-richblack-500 hover:shadow-lg hover:shadow-black/40"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={
                  review?.user?.image ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                }
                alt={review?.user?.firstName}
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-yellow-50/40"
              />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-richblack-5">
                  {review?.user?.firstName} {review?.user?.lastName}
                </p>
                <p className="truncate text-[11px] text-richblack-300">
                  Reviewed · {review?.course?.courseName}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <StarRow rating={review?.rating} />
              <span className="rounded-md bg-yellow-50 px-1.5 py-0.5 text-[11px] font-bold text-richblack-900">
                {Number(review?.rating).toFixed(1)}
              </span>
            </div>

            <div className="relative">
              <FaQuoteLeft className="absolute -top-0.5 left-0 text-base text-richblack-600" />
              <p className="line-clamp-3 pl-6 text-[13px] leading-relaxed text-richblack-200">
                {review?.review}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSlider;
