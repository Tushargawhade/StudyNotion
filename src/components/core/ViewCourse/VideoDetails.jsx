import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { toast } from "react-hot-toast";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { updateCourseProgress } from "../../../services/operations/myCourseAPI";
import { setCompletedVideos } from "../../../slices/viewCourseSlice";

function VideoDetails({ video, courseId }) {
  const { token } = useSelector((state) => state.auth);
  const { completedVideos } = useSelector((state) => state.viewCourse);
  const dispatch = useDispatch();

  const isCompleted = completedVideos.includes(video._id);

  const handleProgressUpdate = async (markIncomplete) => {
    const result = await updateCourseProgress(
      token,
      courseId,
      video._id,
      markIncomplete
    );
    if (result) {
      dispatch(setCompletedVideos(result.data.completedVideos));
      toast.success(
        markIncomplete
          ? "Video marked as incomplete"
          : "Video marked as completed"
      );
    }
  };

  const handleVideoEnded = () => {
    if (!isCompleted) {
      handleProgressUpdate(false);
    }
  };

  return (
    <div className="space-y-4 p-6">
      <div className="overflow-hidden rounded-lg bg-black">
        <Player src={video.videoUrl} onEnded={handleVideoEnded} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-richblack-5">
            {video.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-richblack-200">
            {video.description}
          </p>
        </div>
        <button
          onClick={() => handleProgressUpdate(isCompleted)}
          className={`flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold ${
            isCompleted
              ? "border border-richblack-600 text-richblack-100 hover:border-pink-500 hover:text-pink-500"
              : "bg-yellow-50 text-richblack-900 hover:bg-yellow-25"
          }`}
        >
          {isCompleted ? (
            <>
              <FiXCircle className="text-lg" />
              Mark as Incomplete
            </>
          ) : (
            <>
              <FiCheckCircle className="text-lg" />
              Mark as Completed
            </>
          )}
        </button>
      </div>

      {isCompleted && (
        <p className="flex items-center gap-1.5 text-sm text-caribbeangreen-600">
          <FiCheckCircle className="text-base" />
          Video auto-marks as completed when playback finishes.
        </p>
      )}

      <Link
        to={`/course/${courseId}`}
        className="inline-block text-sm font-medium text-yellow-50 hover:text-yellow-25"
      >
        Go back to course details
      </Link>
    </div>
  );
}

export default VideoDetails;
