const SubSection = require("../models/SubSection");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId, markIncomplete } = req.body;
  const userId = req.user.id;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!course.studentsEnrolled.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    const subsection = await SubSection.findById(subsectionId);

    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "Invalid video",
      });
    }

    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });
    }

    if (markIncomplete) {
      courseProgress.completedVideos = courseProgress.completedVideos.filter(
        (id) => String(id) !== String(subsectionId)
      );
      await courseProgress.save();

      return res.status(200).json({
        success: true,
        message: "Course progress updated",
        data: courseProgress,
      });
    }

    if (courseProgress.completedVideos.includes(subsectionId)) {
      return res.status(200).json({
        success: true,
        message: "Course progress updated",
        data: courseProgress,
      });
    }

    courseProgress.completedVideos.push(subsectionId);
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course progress updated",
      data: courseProgress,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
