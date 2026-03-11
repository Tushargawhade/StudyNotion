const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {login,signup,otp,changePassword} = require("../controllers/Auth")
const {resetPasswordToken,resetPassword} = require("../controllers/ResetPassword")
const { auth } = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// Route for user login
router.post("/login", login)

router.post("/signup", signup)

router.post("/sendotp", otp)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


module.exports = router
