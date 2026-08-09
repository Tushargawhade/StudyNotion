import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import ProgressBar from "@ramonak/react-progress-bar";
import { getFullCourseDetails } from "../services/operations/myCourseAPI";
import {
  setCompletedVideos,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfVideos,
} from "../slices/viewCourseSlice";
import CourseAccordion from "../components/core/course/CourseAccordion";
import VideoDetails from "../components/core/ViewCourse/VideoDetails";
import Spinner from "../components/common/Spinner";

function ViewCourse() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const {
    courseSectionData,
    courseEntireData,
    completedVideos,
    totalNoOfVideos,
  } = useSelector((state) => state.viewCourse);

  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChapters, setShowChapters] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getFullCourseDetails(courseId, token);
        dispatch(setCourseSectionData(data.courseDetails.courseContent));
        dispatch(setEntireCourseData(data.courseDetails));
        dispatch(setCompletedVideos(data.completedVideos || []));
        const totalVideos = data.courseDetails.courseContent.reduce(
          (acc, s) => acc + (s.subSection?.length || 0),
          0
        );
        dispatch(setTotalNoOfVideos(totalVideos));
        const allLectures = data.courseDetails.courseContent.flatMap(
          (s) => s.subSection || []
        );
        const resumeId = localStorage.getItem(
          `studyverse-resume-${courseId}`
        );
        const resumeVideo =
          allLectures.find((l) => l._id === resumeId) || null;
        setCurrentVideo(
          resumeVideo || allLectures[0] || null
        );
      } catch (error) {
        toast.error(error.message || "Could not load course");
      }
      setLoading(false);
    })();
  }, [courseId, token, dispatch]);

  const handleLectureClick = (lecture) => {
    setCurrentVideo(lecture);
    setShowChapters(false);
    localStorage.setItem(`studyverse-resume-${courseId}`, lecture._id);
  };

  if (loading) {
    return <Spinner />;
  }

  if (!courseSectionData || courseSectionData.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-lg font-semibold text-richblack-200">
          No course content yet.
        </p>
      </div>
    );
  }

  if (!user?.courses?.includes(courseId)) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-richblack-200">
          You are not enrolled in this course
        </p>
        <Link
          to={`/course/${courseId}`}
          className="rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 hover:bg-yellow-25"
        >
          View Course
        </Link>
      </div>
    );
  }

  const progressPercent =
    totalNoOfVideos > 0
      ? Math.round((completedVideos.length / totalNoOfVideos) * 100)
      : 0;

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      <div className="flex items-center justify-between border-b border-richblack-700 bg-richblack-900 px-4 py-3 lg:hidden">
        <button
          onClick={() => setShowChapters((prev) => !prev)}
          className="flex items-center gap-2 rounded-md border border-richblack-600 px-3 py-1.5 text-sm font-medium text-richblack-25 transition-colors duration-200 hover:border-yellow-50 hover:text-yellow-50"
          aria-label="Toggle course chapters"
        >
          {showChapters ? (
            <FiChevronDown className="rotate-180 text-lg" />
          ) : (
            <FiMenu className="text-lg" />
          )}
          Chapters
        </button>
        <span className="text-xs font-medium text-richblack-300">
          {completedVideos.length} / {totalNoOfVideos} done
        </span>
      </div>

      <div
        className={`${
          showChapters ? "block" : "hidden"
        } border-r border-richblack-700 bg-richblack-900 p-4 lg:block lg:h-[calc(100vh-3.5rem)] lg:w-1/3 lg:overflow-y-auto`}
      >
        <div className="mb-4 rounded-md border border-richblack-700 bg-richblack-800 p-4">
          <img
            src={courseEntireData?.thumbnail}
            alt={courseEntireData?.courseName}
            className="aspect-video w-full rounded-md object-cover"
          />
          <p className="mt-3 text-sm font-semibold text-richblack-5">
            {courseEntireData?.courseName}
          </p>
          <div className="mt-3">
            <ProgressBar
              completed={progressPercent}
              bgColor="#ffd33c"
              baseBgColor="#2c2c2c"
              height="8px"
              borderRadius="4px"
              isLabelVisible={false}
            />
          </div>
          <p className="mt-2 text-xs text-richblack-300">
            {completedVideos.length} / {totalNoOfVideos} videos completed
          </p>
        </div>

        <CourseAccordion
          course={courseEntireData}
          onLectureClick={handleLectureClick}
        />
      </div>

      <div className="h-auto flex-1 overflow-y-auto lg:h-[calc(100vh-3.5rem)]">
        {currentVideo ? (
          <VideoDetails video={currentVideo} courseId={courseId} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-lg font-semibold text-richblack-200">
              Select a lecture to start learning
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewCourse;
