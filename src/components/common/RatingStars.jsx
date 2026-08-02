import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";

function RatingStars({ Review_Count, Star_Size }) {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    if (Review_Count) {
      const totalRating = Review_Count.reduce(
        (acc, curr) => acc + curr.rating,
        0
      );
      const avg = totalRating / Review_Count.length;
      setStars(Math.round(avg * 10) / 10);
    }
  }, [Review_Count]);

  return (
    <div>
      <ReactStars
        count={5}
        value={stars}
        size={Star_Size || 20}
        edit={false}
        activeColor="#ffd33c"
      />
    </div>
  );
}

export default RatingStars;
