import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";
import { editCourse } from "../../../services/operations/courseDetailsAPI";
import {
  resetCourseState,
  setStep,
} from "../../../slices/courseSlice";
import IconBtn from "../../common/IconBtn";

function CoursePublishForm() {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const goBack = () => dispatch(setStep(2));

  const handlePublish = async (status) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("courseId", course._id);
    formData.append("status", status);
    try {
      await editCourse(formData, token);
      toast.success(
        status === "Published"
          ? "Course published successfully"
          : "Course saved as draft"
      );
      dispatch(resetCourseState());
      navigate("/dashboard/my-courses");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
  };

  const sectionCount = course?.courseContent?.length || 0;
  const lectureCount = course?.courseContent?.reduce(
    (acc, s) => acc + (s.subSection?.length || 0),
    0
  );
  const categoryName =
    typeof course?.category === "object"
      ? course.category.name
      : course.category;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <FaCheckCircle className="text-2xl text-yellow-50" />
        <p className="text-lg font-semibold text-richblack-5">
          Course is ready to be published
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-md border border-richblack-700 bg-richblack-900 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="aspect-video w-40 rounded-md object-cover"
            />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-richblack-5">
                {course?.courseName}
              </p>
              <p className="text-sm text-richblack-200">
                {course?.courseDescription}
              </p>
              <p className="text-sm text-yellow-50">Rs. {course?.price}</p>
              <p className="text-xs text-richblack-300">
                Category: {categoryName}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setStep(1))}
            className="rounded-md border border-yellow-50 bg-transparent px-4 py-2 text-sm font-semibold text-yellow-50 hover:bg-yellow-50 hover:text-richblack-900"
          >
            Edit
          </button>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <span className="rounded-full bg-richblack-700 px-3 py-1 text-richblack-200">
            {sectionCount} Sections
          </span>
          <span className="rounded-full bg-richblack-700 px-3 py-1 text-richblack-200">
            {lectureCount} Lectures
          </span>
          {course?.tag?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-yellow-50 px-3 py-1 font-medium text-richblack-900"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-x-4">
        <IconBtn text="Back" onclick={goBack} outline />
        <IconBtn
          text="Save as Draft"
          onclick={() => handlePublish("Draft")}
          disabled={loading}
          outline
          customClasses="border-richblack-200 text-richblack-200 hover:border-richblack-100"
        />
        <IconBtn
          onclick={() => handlePublish("Published")}
          disabled={loading}
          customClasses="px-6"
        >
          <span>Publish Course</span>
          {!loading && <IoArrowForward className="text-lg" />}
        </IconBtn>
      </div>
    </div>
  );
}

export default CoursePublishForm;
