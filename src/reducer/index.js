import { combineReducers } from "redux";

import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import courseReducer from "../slices/courseSlice";
import viewCourseReducer from "../slices/viewCourseSlice";
import wishlistReducer from "../slices/wishlistSlice";


const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    course: courseReducer,
    viewCourse: viewCourseReducer,
    wishlist: wishlistReducer,
})

export default rootReducer;
