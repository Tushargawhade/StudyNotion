const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const CourseProgress = require('../models/CourseProgress');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration');
require('dotenv').config();

// parse comma/JSON string into array (FormData sends strings)
const parseToList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch (e) {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
};

// Create course handler function
exports.createCourse = async (req, res) => {
  try {
    let { courseName, courseDescription, whatYouWillLearn, price, tag, category, status, instructions } = req.body;

    const thumbnail = req.files.thumbnailImage || req.files.thumbnail;

    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for course creation",
      });
    }

    const userId = req.user.id;
    const instructorDetails = await User.findById(userId, { password: 0 });
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: parseToList(tag),
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status || "Draft",
      instructions: parseToList(instructions),
    });

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    await Category.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in creating course",
      error: error.message,
    });
  }
};

// Get all courses (only published)
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({ status: "Published" }, {
      courseName: true,
      price: true,
      thumbnail: true,
      instructor: true,
      ratingAndReviews: true,
      studentsEnrolled: true,
      category: true,
    })
      .populate("instructor")
      .populate("category")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot fetch all courses",
    });
  }
};

// Show all details of a single course (without video URLs)
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate({
        path: "ratingAndReviews",
        populate: { path: "user", select: "firstName lastName image" },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Course details not found for the given course ID",
      });
    }

    if (courseDetails.status !== "Published") {
      const isInstructor =
        req.user && String(req.user.id) === String(courseDetails.instructor._id);
      if (!isInstructor) {
        return res.status(404).json({
          success: false,
          message: "Course details not found for the given course ID",
        });
      }
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        totalDurationInSeconds += parseInt(subSection.timeDuration) || 0;
      });
    });
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: { courseDetails, totalDuration },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching course details",
      error: error.message,
    });
  }
};

// Get full course details (with video URLs) for enrolled students
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Course details not found for the given course ID",
      });
    }

    const isEnrolled = courseDetails.studentsEnrolled.some(
      (id) => String(id) === String(userId)
    );
    const isInstructorCourse =
      String(courseDetails.instructor._id) === String(userId);
    if (!isEnrolled && !isInstructorCourse) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        totalDurationInSeconds += parseInt(subSection.timeDuration) || 0;
      });
    });
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      message: "Full course details fetched successfully",
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching full course details",
      error: error.message,
    });
  }
};

// Edit a course
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (req.files) {
      const thumbnail = req.files.thumbnailImage || req.files.thumbnail;
      if (thumbnail) {
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        course.thumbnail = thumbnailImage.secure_url;
      }
    }

    if (updates.tag !== undefined) course.tag = parseToList(updates.tag);
    if (updates.instructions !== undefined) course.instructions = parseToList(updates.instructions);

    for (const key in updates) {
      if (["tag", "instructions", "courseId"].includes(key)) continue;
      if (updates[key] !== undefined) course[key] = updates[key];
    }

    await course.save();

    const updatedCourse = await Course.findOne({ _id: courseId })
      .populate({ path: "instructor", populate: { path: "additionalDetails" } })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in updating course",
      error: error.message,
    });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // unenroll all students from the course
    await User.updateMany(
      { courses: courseId },
      { $pull: { courses: courseId } }
    );

    // delete all subsections and sections of the course
    for (const sectionId of course.courseContent) {
      const section = await Section.findById(sectionId);
      if (section) {
        await SubSection.deleteMany({ _id: { $in: section.subSection } });
      }
    }
    await Section.deleteMany({ _id: { $in: course.courseContent } });

    await Course.findByIdAndDelete(courseId);

    await Category.updateMany(
      { courses: courseId },
      { $pull: { courses: courseId } }
    );

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in deleting course",
      error: error.message,
    });
  }
};

// Search published courses by keyword
exports.searchCourses = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const query = q.trim();
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const allCourses = await Course.find({ status: "Published" })
      .populate("instructor")
      .populate("category");

    const matchedCourses = allCourses.filter((course) => {
      const fields = [
        course.courseName,
        course.courseDescription,
        course.category?.name,
        course.instructor?.firstName,
        course.instructor?.lastName,
      ];
      const text = [...fields, ...(course.tag || [])]
        .filter(Boolean)
        .join(" ");
      return regex.test(text);
    });

    return res.status(200).json({
      success: true,
      message: "Search results fetched successfully",
      data: matchedCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in searching courses",
      error: error.message,
    });
  }
};

// Get all courses of an instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const allCourses = await Course.find({ instructor: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .populate("category");

    return res.status(200).json({
      success: true,
      message: "Instructor courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot fetch instructor courses",
      error: error.message,
    });
  }
};
