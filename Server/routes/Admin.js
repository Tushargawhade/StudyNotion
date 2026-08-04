const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middlewares/auth");
const {
  getStats,
  getAllInstructors,
  updateInstructorApproval,
  getAllStudents,
  toggleStudentStatus,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/Admin");

router.get("/stats", auth, isAdmin, getStats);
router.get("/instructors", auth, isAdmin, getAllInstructors);
router.put("/instructors/approval", auth, isAdmin, updateInstructorApproval);
router.get("/students", auth, isAdmin, getAllStudents);
router.put("/students/status", auth, isAdmin, toggleStudentStatus);
router.get("/categories", auth, isAdmin, getAllCategories);
router.post("/categories", auth, isAdmin, createCategory);
router.put("/categories", auth, isAdmin, updateCategory);
router.delete("/categories", auth, isAdmin, deleteCategory);

module.exports = router;
