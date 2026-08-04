const Course = require('../models/Course');
const User = require('../models/User');
const CourseProgress = require('../models/CourseProgress');
const Purchase = require('../models/Purchase');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/courseEnrollmentEmail');

// Demo enrollment (no payment) — lets a student enroll in a published course
exports.demoEnroll = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseDetails = await Course.findById(courseId);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (courseDetails.status !== "Published") {
      return res.status(400).json({
        success: false,
        message: "This course is not published yet",
      });
    }

    if (courseDetails.studentsEnrolled.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in the course",
      });
    }

    await Course.findByIdAndUpdate(
      courseId,
      { $push: { studentsEnrolled: userId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      { $push: { courses: courseId } },
      { new: true }
    );

    await CourseProgress.create({
      courseID: courseId,
      userId: userId,
      completedVideos: [],
    });

    await Purchase.findOneAndUpdate(
      { user: userId, course: courseId },
      { user: userId, course: courseId, price: courseDetails.price },
      { upsert: true, new: true }
    );

    try {
      const user = await User.findById(userId);
      if (user) {
        await mailSender(
          user.email,
          "Enrolled in " + courseDetails.courseName,
          courseEnrollmentEmail(courseDetails.courseName, user.firstName)
        );
      }
    } catch (error) {
      console.error("Enrollment email failed:", error.message);
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in enrolling student",
      error: error.message,
    });
  }
};
