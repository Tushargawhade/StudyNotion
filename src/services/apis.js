const BASE_URL = process.env.REACT_APP_BASE_URL

export const categories = {
    CATEGORIES_API: BASE_URL + "/course/showAllCategories",
}

export const endpoints = {
    // auth
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",

    // contact
    CONTACT_API: BASE_URL + "/contact/createContact",

    // course
    CREATE_COURSE_API: BASE_URL + "/course/createCourse",
    EDIT_COURSE_API: BASE_URL + "/course/editCourse",
    DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
    GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
    COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
    FULL_COURSE_DETAILS_API: BASE_URL + "/course/getFullCourseDetails",
    INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
    DEMO_ENROLL_API: BASE_URL + "/course/demoEnroll",
    UPDATE_COURSE_PROGRESS_API: BASE_URL + "/course/updateCourseProgress",

    // section
    SECTION_CREATE_API: BASE_URL + "/course/addSection",
    SECTION_UPDATE_API: BASE_URL + "/course/updateSection",
    SECTION_DELETE_API: BASE_URL + "/course/deleteSection",

    // subsection
    SUBSECTION_CREATE_API: BASE_URL + "/course/addSubSection",
    SUBSECTION_UPDATE_API: BASE_URL + "/course/updateSubSection",
    SUBSECTION_DELETE_API: BASE_URL + "/course/deleteSubSection",

    // category
    CREATE_CATEGORY_API: BASE_URL + "/course/createCategory",
    GET_CATEGORY_DETAILS_API: BASE_URL + "/course/getCategoryPageDetails",

    // rating
    RATING_API: BASE_URL + "/course/createRating",
    REVIEWS_API: BASE_URL + "/course/getReviews",
    AVERAGE_RATING_API: BASE_URL + "/course/getAverageRating",

    // profile
    GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
    GET_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
    INSTRUCTOR_DASHBOARD_API: BASE_URL + "/profile/instructorDashboard",
    DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}
