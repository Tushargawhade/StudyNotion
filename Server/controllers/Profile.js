const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require('../models/Course');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require('dotenv').config();

// update profile handler function
exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", gender, about = "", contactNumber } = req.body;

    const userId = req.user.id;

    if (!gender || !contactNumber || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedDetails: profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update display picture handler function
exports.updateDisplayPicture = async (req, res) => {
  try {
    const { displayPicture } = req.files;

    const image = await uploadImageToCloudinary(displayPicture, process.env.FOLDER_NAME);

    const updatedProfile = await User.findByIdAndUpdate(
      req.user.id,
      { image: image.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in updating display picture",
      error: error.message,
    });
  }
};

// get enrolled courses handler function
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    let userDetails = await User.findOne({ _id: userId })
      .populate("courses")
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Could not find user with an id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching enrolled courses",
      error: error.message,
    });
  }
};

// instructor dashboard handler function
exports.instructorDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const courseDetails = await Course.find({ instructor: userId });

    const totalCourses = courseDetails.length;
    const totalStudentsEnrolled = courseDetails.reduce(
      (acc, course) => acc + course.studentsEnrolled.length,
      0
    );
    const totalRevenue = courseDetails.reduce(
      (acc, course) => acc + course.price * course.studentsEnrolled.length,
      0
    );

    return res.status(200).json({
      success: true,
      message: "Instructor dashboard data fetched successfully",
      data: {
        totalCourses,
        totalStudentsEnrolled,
        totalRevenue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching instructor dashboard data",
      error: error.message,
    });
  }
};

// delete account handler function
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    if (!id) {
      return res.status(404).json({
        success: false,
        message: "User not found!!",
      });
    }

    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // unenroll user from all enrolled courses
    for (const courseId of userDetails.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnrolled: id } },
        { new: true }
      );
    }

    // delete profile
    await Profile.findByIdAndDelete(userDetails.additionalDetails);

    // delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully....",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User account cannot be deleted",
      error: error.message,
    });
  }
};

// get user handler function
exports.getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const userDetails = await User.findById(userId).populate("additionalDetails").exec();

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully....",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching user!!",
      error: error.message,
    });
  }
};
