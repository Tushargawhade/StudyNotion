import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  course: null,
  editCourse: false,
};

const courseSlice = createSlice({
  name: "course",
  initialState: initialState,
  reducers: {
    setStep(state, value) {
      state.step = value.payload;
    },
    setCourse(state, value) {
      state.course = value.payload;
    },
    setEditCourse(state, value) {
      state.editCourse = value.payload;
    },
    resetCourseState(state) {
      state.step = 1;
      state.course = null;
      state.editCourse = false;
    },
  },
});

export const {
  setStep,
  setCourse,
  setEditCourse,
  resetCourseState,
} = courseSlice.actions;
export default courseSlice.reducer;
