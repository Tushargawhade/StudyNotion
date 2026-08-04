import { toast } from "react-hot-toast";
import { endpoints } from "../apis";
import { apiConnector } from "../apiconnector";

const tokenHeader = (token) => ({ Authorization: `Bearer ${token}` });

export async function fetchAdminStats(token) {
  const result = await apiConnector(
    "GET",
    endpoints.ADMIN_STATS_API,
    null,
    tokenHeader(token)
  );
  if (!result.data.success) throw new Error(result.data.message);
  return result.data.data;
}

export async function fetchAllInstructors(token) {
  const result = await apiConnector(
    "GET",
    endpoints.ADMIN_INSTRUCTORS_API,
    null,
    tokenHeader(token)
  );
  if (!result.data.success) throw new Error(result.data.message);
  return result.data.data;
}

export async function updateInstructorApproval(instructorId, approved, token) {
  const result = await apiConnector(
    "PUT",
    endpoints.ADMIN_INSTRUCTOR_APPROVAL_API,
    { instructorId, approved },
    tokenHeader(token)
  );
  if (!result.data.success) throw new Error(result.data.message);
  toast.success(result.data.message);
  return result.data.data;
}

export async function fetchAllStudents(token) {
  const result = await apiConnector(
    "GET",
    endpoints.ADMIN_STUDENTS_API,
    null,
    tokenHeader(token)
  );
  if (!result.data.success) throw new Error(result.data.message);
  return result.data.data;
}

export async function toggleStudentStatus(studentId, active, token) {
  const result = await apiConnector(
    "PUT",
    endpoints.ADMIN_STUDENT_STATUS_API,
    { studentId, active },
    tokenHeader(token)
  );
  if (!result.data.success) throw new Error(result.data.message);
  toast.success(result.data.message);
  return result.data.data;
}

export async function fetchAllCategories(token) {
  const result = await apiConnector(
    "GET",
    endpoints.ADMIN_CATEGORIES_API,
    null,
    tokenHeader(token)
  );
  if (!result.data.success) throw new Error(result.data.message);
  return result.data.data;
}

export async function createCategory(name, description, token) {
  const result = await apiConnector(
    "POST",
    endpoints.ADMIN_CATEGORIES_API,
    { name, description },
    tokenHeader(token)
  );
  if (!result.data.success) throw new Error(result.data.message);
  toast.success("Category created");
  return result.data.data;
}

export async function updateCategory(categoryId, name, description, token) {
  const result = await apiConnector(
    "PUT",
    endpoints.ADMIN_CATEGORIES_API,
    { categoryId, name, description },
    tokenHeader(token)
  );
  if (!result.data.success) throw new Error(result.data.message);
  toast.success("Category updated");
  return result.data.data;
}

export async function deleteCategory(categoryId, token) {
  const result = await apiConnector(
    "DELETE",
    endpoints.ADMIN_CATEGORIES_API,
    { categoryId },
    tokenHeader(token)
  );
  if (!result.data.success) throw new Error(result.data.message);
  toast.success("Category deleted");
  return result.data;
}
