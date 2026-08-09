const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const Purchase = require('../models/Purchase');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require('dotenv').config();

// update profile handler function
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      about,
      contactNumber,
    } = req.body;

    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileDetails = await Profile.findById(userDetails.additionalDetails);

    if (dateOfBirth !== undefined) profileDetails.dateOfBirth = dateOfBirth;
    if (gender !== undefined) profileDetails.gender = gender;
    if (about !== undefined) profileDetails.about = about;
    if (contactNumber !== undefined) {
      const normalized = normalizeContactNumber(contactNumber);
      profileDetails.contactNumber = normalized;
    }
    await profileDetails.save();

    if (firstName !== undefined) userDetails.firstName = firstName;
    if (lastName !== undefined) userDetails.lastName = lastName;
    if (contactNumber !== undefined) {
      userDetails.contactNumber = normalizeContactNumber(contactNumber);
    }
    await userDetails.save();

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

function normalizeContactNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

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
      .populate({
        path: "courses",
        populate: [
          {
            path: "instructor",
            select: "firstName lastName image additionalDetails",
            populate: { path: "additionalDetails" },
          },
          { path: "category", select: "name" },
          { path: "ratingAndReviews" },
          {
            path: "courseContent",
            populate: { path: "subSection", select: "title timeDuration" },
          },
        ],
      })
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Could not find user with an id",
      });
    }

    const courseIds = userDetails.courses.map((course) => course._id);

    const progressRecords = await CourseProgress.find({
      userId: userId,
      courseID: { $in: courseIds },
    });

    const progressMap = {};
    progressRecords.forEach((record) => {
      progressMap[String(record.courseID)] = record.completedVideos || [];
    });

    const courses = userDetails.courses.map((course) => {
      const totalVideos = course.courseContent.reduce(
        (acc, section) => acc + (section.subSection?.length || 0),
        0
      );
      const completedVideos = progressMap[String(course._id)] || [];
      const percent =
        totalVideos > 0
          ? Math.round((completedVideos.length / totalVideos) * 100)
          : 0;
      let status = "Not Started";
      if (completedVideos.length > 0 && percent < 100) {
        status = "In Progress";
      } else if (percent >= 100) {
        status = "Completed";
      }

      const plainCourse = course.toObject();
      plainCourse.progress = {
        completedVideos: completedVideos.length,
        totalVideos,
        percent,
        status,
      };
      return plainCourse;
    });

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching enrolled courses",
      error: error.message,
    });
  }
};

// purchase history handler function
exports.getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    let userDetails = await User.findById(userId).populate("courses").exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Could not find user with an id",
      });
    }

    // Backfill Purchase records for enrollments made before purchases were tracked
    for (const course of userDetails.courses) {
      const exists = await Purchase.findOne({ user: userId, course: course._id });
      if (!exists) {
        await Purchase.create({
          user: userId,
          course: course._id,
          price: course.price || 0,
        });
      }
    }

    const purchases = await Purchase.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "course",
        select: "courseName thumbnail price status studentsEnrolled",
        populate: [
          {
            path: "instructor",
            select: "firstName lastName image",
          },
          { path: "category", select: "name" },
        ],
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Purchase history fetched successfully",
      data: purchases,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching purchase history",
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
