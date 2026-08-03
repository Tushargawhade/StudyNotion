import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CourseBuilder from "../components/core/course/CourseBuilder";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../slices/courseSlice";

function EditCourse() {
  const dispatch = useDispatch();
  const { courseId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCourseDetails(courseId);
        if (data?.courseDetails) {
          dispatch(setCourse(data.courseDetails));
          dispatch(setEditCourse(true));
        }
      } catch (error) {
        console.error("Could not load course details", error);
      }
    })();
  }, [courseId, dispatch]);

  return <CourseBuilder />;
}

export default EditCourse;
