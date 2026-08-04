import { createSlice } from "@reduxjs/toolkit";

const readStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: readStoredUser(),
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload;
      try {
        if (value.payload === null) {
          localStorage.removeItem("user");
        } else {
          localStorage.setItem("user", JSON.stringify(value.payload));
        }
      } catch (error) {
        // ignore storage errors
      }
    },
  },
});

export const { setUser } = profileSlice.actions;
export default profileSlice.reducer;
