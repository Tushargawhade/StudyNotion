const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;

  try {
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
