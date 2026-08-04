const express = require("express")
const router = express.Router()

// Course Controllers Import
const { createCourse, editCourse, deleteCourse, getInstructorCourses, getFullCourseDetails, getAllCourses, getCourseDetails, searchCourses } = require("../controllers/Course")

const { updateCourseProgress } = require("../controllers/courseProgress")

const { demoEnroll } = require("../controllers/Enrollment")

// Categories Controllers Import
const { showAllCategory, createCategory, categoryPageDetails } = require("../controllers/Category")

// Sections Controllers Import
const { createSection, updateSection, deleteSection } = require("../controllers/Section")

// Sub-Sections Controllers Import
const { createSubsection, updateSubSection, deleteSubSection, getVideoUploadSignature } = require("../controllers/Subsection")

// Rating Controllers Import
const { createRating, getAverageRating, getAllRating, updateReview, deleteReview } = require("../controllers/RatingAndReview")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin, authOptional } = require("../middlewares/auth")

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)

// Edit Course
router.post("/editCourse", auth, isInstructor, editCourse)

// Delete Course
router.post("/deleteCourse", auth, isInstructor, deleteCourse)

// Instructor Courses
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)

// Get Full Course Details (for enrolled students, includes video urls)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)

// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)

// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)

// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)

// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)

// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubsection)

// Get signed params for direct browser -> Cloudinary video upload
router.get("/videoUploadSignature", auth, isInstructor, getVideoUploadSignature)

// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)

// Search Courses
router.get("/searchCourses", searchCourses)

// Get Details for a Specific Course
router.post("/getCourseDetails", authOptional, getCourseDetails)

// Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

// Demo Enrollment (no payment, for demo purposes)
router.post("/demoEnroll", auth, isStudent, demoEnroll)

// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)

router.get("/showAllCategories", showAllCategory)

router.post("/getCategoryPageDetails", categoryPageDetails)

router.post("/createRating", auth, isStudent, createRating)

router.put("/updateReview", auth, isStudent, updateReview)

router.delete("/deleteReview", auth, isStudent, deleteReview)

router.get("/getAverageRating", getAverageRating)

router.get("/getReviews", getAllRating)

module.exports = router
