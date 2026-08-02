import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { getAllRatings } from "../../services/operations/courseDetailsAPI";
import RatingStars from "./RatingStars";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllRatings();
        setReviews(data || []);
      } catch (error) {
        setReviews([]);
      }
    })();
  }, []);

  return (
    <div className="w-11/12 mx-auto max-w-maxContent text-white">
      <Swiper
        slidesPerView={1}
        spaceBetween={25}
        loop={true}
        freeMode={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        modules={[FreeMode, Pagination, Navigation, Autoplay]}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="max-h-[30rem]"
      >
        {reviews?.map((review, i) => (
          <SwiperSlide key={i}>
            <div className="flex flex-col gap-3 bg-richblack-800 p-4 text-[14px] text-richblack-200">
              <div className="flex items-center gap-3">
                <img
                  src={
                    review?.user?.image ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                  }
                  alt={review?.user?.firstName}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <h1 className="font-semibold text-richblack-5">
                    {review?.user?.firstName} {review?.user?.lastName}
                  </h1>
                  <p className="text-xs">{review?.course?.courseName}</p>
                </div>
              </div>
              <p>{review?.review}</p>
              <div className="flex items-center gap-2 text-yellow-100">
                <FaStar className="text-yellow-50" />
                <span>{review?.rating}</span>
                <RatingStars Review_Count={[{ rating: review?.rating }]} Star_Size={14} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ReviewSlider;
