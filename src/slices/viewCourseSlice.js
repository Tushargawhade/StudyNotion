import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseSectionData: [],
  courseEntireData: [],
  completedVideos: [],
  totalNoOfVideos: 0,
};

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState: initialState,
  reducers: {
    setCourseSectionData(state, value) {
      state.courseSectionData = value.payload;
    },
    setEntireCourseData(state, value) {
      state.courseEntireData = value.payload;
    },
    setCompletedVideos(state, value) {
      state.completedVideos = value.payload;
    },
    setTotalNoOfVideos(state, value) {
      state.totalNoOfVideos = value.payload;
    },
  },
});

export const {
  setCourseSectionData,
  setEntireCourseData,
  setCompletedVideos,
  setTotalNoOfVideos,
} = viewCourseSlice.actions;
export default viewCourseSlice.reducer;
