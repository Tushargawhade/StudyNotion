const express = require("express")
const router = express.Router()

const { isInstructor, auth } = require("../middlewares/auth")
const { deleteAccount, updateProfile, getAllUserDetails, updateDisplayPicture, getEnrolledCourses, getPurchaseHistory, instructorDashboard } = require("../controllers/Profile")

// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount)

// Update Profile
router.put("/updateProfile", auth, updateProfile)

// Get User Details
router.get("/getUserDetails", auth, getAllUserDetails)

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)

// Get Purchase History
router.get("/getPurchaseHistory", auth, getPurchaseHistory)

// Update Display Picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

// Instructor Dashboard
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router
