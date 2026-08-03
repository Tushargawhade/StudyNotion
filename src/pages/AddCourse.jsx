import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import CourseBuilder from "../components/core/course/CourseBuilder";
import { resetCourseState, setStep } from "../slices/courseSlice";

function AddCourse() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCourseState());
    dispatch(setStep(1));
  }, [dispatch]);

  return <CourseBuilder />;
}

export default AddCourse;
