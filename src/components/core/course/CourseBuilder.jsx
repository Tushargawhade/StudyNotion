import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
import { resetCourseState, setStep } from "../../../slices/courseSlice";
import CourseInformationForm from "./CourseInformationForm";
import CourseBuilderForm from "./CourseBuilderForm";
import CoursePublishForm from "./CoursePublishForm";

const steps = ["Course Information", "Course Builder", "Publish"];

function CourseBuilder() {
  const { step } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBack = () => {
    if (step > 1) {
      dispatch(setStep(step - 1));
    } else {
      navigate("/dashboard/my-courses");
    }
  };

  const handleCancel = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  return (
    <div className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-semibold text-richblack-100 hover:text-richblack-5"
        >
          <IoIosArrowBack className="text-lg" />
          Back
        </button>
        <button
          onClick={handleCancel}
          className="text-sm font-semibold text-richblack-200 hover:text-pink-500"
        >
          Cancel
        </button>
      </div>

      <div className="flex items-center justify-center gap-2">
        {steps.map((label, i) => {
          const n = i + 1;
          return (
            <React.Fragment key={label}>
              <button
                onClick={() => n < step && dispatch(setStep(n))}
                className={`flex items-center gap-2 ${
                  n < step ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold leading-none ${
                    step >= n
                      ? "bg-yellow-50 text-richblack-900"
                      : "bg-richblack-700 text-richblack-300"
                  }`}
                >
                  {n < step ? <FiCheck /> : n}
                </span>
                <span
                  className={`hidden text-sm sm:block ${
                    step >= n ? "text-richblack-5" : "text-richblack-300"
                  }`}
                >
                  {label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`h-[2px] w-10 sm:w-16 ${
                    step > n ? "bg-yellow-50" : "bg-richblack-700"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <CoursePublishForm />}
    </div>
  );
}

export default CourseBuilder;

