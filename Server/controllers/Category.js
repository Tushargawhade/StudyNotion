const Category = require("../models/Category");

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

// create category handler function
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const categoryDetails = await Category.create({
      name: name,
      description: description || "",
    });

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: categoryDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Show all category handler function
exports.showAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find({}, { name: true, description: true });

    return res.status(200).json({
      success: true,
      message: "All categories returned successfully",
      data: allCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// categoryPageDetails handle function
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: { path: "ratingAndReviews" },
      })
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category",
      });
    }

    const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId } });

    let differentCategory = null;
    if (categoriesExceptSelected.length > 0) {
      const randomIndex = getRandomInt(categoriesExceptSelected.length);
      differentCategory = await Category.findById(categoriesExceptSelected[randomIndex]._id)
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec();
    }

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: { path: "instructor" },
      })
      .exec();

    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      message: "Category page details fetched successfully",
      data: { selectedCategory, differentCategory, mostSellingCourses },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
