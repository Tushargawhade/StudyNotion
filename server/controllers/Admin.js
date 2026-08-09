const User = require('../models/User');
const Course = require('../models/Course');
const Category = require('../models/Category');
const Purchase = require('../models/Purchase');

const safeUser = "-password -token -otp -resetPasswordExpires";

// get overview stats for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalInstructors,
      totalCourses,
      totalCategories,
      totalEnrollments,
      totalRevenue,
      pendingInstructors,
    ] = await Promise.all([
      User.countDocuments({ accountType: 'Student' }),
      User.countDocuments({ accountType: 'Instructor' }),
      Course.countDocuments({}),
      Category.countDocuments({}),
      Purchase.countDocuments({}),
      Purchase.aggregate([
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
      User.countDocuments({ accountType: 'Instructor', approved: false }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalInstructors,
        totalCourses,
        totalCategories,
        totalEnrollments,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingInstructors,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get all instructors with course & student counts
exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find(
      { accountType: 'Instructor' },
      safeUser
    ).populate('additionalDetails').lean();

    const enriched = await Promise.all(
      instructors.map(async (instructor) => {
        const courses = await Course.find(
          { instructor: instructor._id },
          'courseName status studentsEnrolled'
        ).lean();
        const studentCount = courses.reduce(
          (acc, c) => acc + (c.studentsEnrolled?.length || 0),
          0
        );
        return {
          ...instructor,
          courseCount: courses.length,
          studentCount,
          courses,
        };
      })
    );

    return res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// approve or reject instructor
exports.updateInstructorApproval = async (req, res) => {
  try {
    const { instructorId, approved } = req.body;

    if (!instructorId || typeof approved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'instructorId and approved are required',
      });
    }

    const instructor = await User.findByIdAndUpdate(
      instructorId,
      { approved },
      { new: true }
    );

    if (!instructor || instructor.accountType !== 'Instructor') {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Instructor ${approved ? 'approved' : 'rejected'}`,
      data: instructor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get all students with enrolled course count
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find(
      { accountType: 'Student' },
      safeUser
    ).populate('additionalDetails').lean();

    const enriched = students.map((student) => ({
      ...student,
      courseCount: student.courses?.length || 0,
    }));

    return res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// block or unblock student
exports.toggleStudentStatus = async (req, res) => {
  try {
    const { studentId, active } = req.body;

    if (!studentId || typeof active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'studentId and active are required',
      });
    }

    const student = await User.findByIdAndUpdate(
      studentId,
      { active },
      { new: true }
    );

    if (!student || student.accountType !== 'Student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Student ${active ? 'unblocked' : 'blocked'}`,
      data: student,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get all categories with course counts
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate('courses', 'courseName')
      .lean();

    const data = categories.map((category) => ({
      ...category,
      courseCount: category.courses?.length || 0,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// create category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || '',
    });

    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// update category
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId, name, description } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'categoryId is required',
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description;
    await category.save();

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'categoryId is required',
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    await Course.updateMany(
      { category: categoryId },
      { $unset: { category: 1 } }
    );

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
