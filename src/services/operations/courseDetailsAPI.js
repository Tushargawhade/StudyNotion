import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { endpoints, categories } from "../apis";

const {
  COURSE_DETAILS_API,
  RATING_API,
  REVIEWS_API,
  GET_CATEGORY_DETAILS_API,
} = endpoints;

export async function fetchCourseDetails(courseId) {
  const result = await apiConnector("POST", COURSE_DETAILS_API, { courseId });
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}

export async function fetchCourseCategories() {
  const result = await apiConnector("GET", categories.CATEGORIES_API);
  return result.data.data;
}

export async function fetchCategoryPageDetails(categoryId) {
  const result = await apiConnector("POST", GET_CATEGORY_DETAILS_API, {
    categoryId,
  });
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}

export async function getAllRatings() {
  const result = await apiConnector("GET", REVIEWS_API);
  return result.data.data;
}

export async function addRatingAndReview(
  courseId,
  rating,
  review,
  token
) {
  const result = await apiConnector(
    "POST",
    RATING_API,
    { courseId, rating, review },
    { Authorization: `Bearer ${token}` }
  );

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  toast.success("Rating and review added successfully");
}

export async function createCourse(formData, token) {
  const result = await apiConnector("POST", endpoints.CREATE_COURSE_API, formData, {
    Authorization: `Bearer ${token}`,
  });
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  toast.success("Course created successfully");
  return result.data.data;
}

export async function editCourse(formData, token) {
  const result = await apiConnector("POST", endpoints.EDIT_COURSE_API, formData, {
    Authorization: `Bearer ${token}`,
  });
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  toast.success("Course updated successfully");
  return result.data.data;
}

export async function deleteCourse(token, courseId) {
  const result = await apiConnector(
    "POST",
    endpoints.DELETE_COURSE_API,
    { courseId },
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  toast.success("Course deleted successfully");
  return result.data;
}

export async function fetchInstructorCourses(token) {
  const result = await apiConnector(
    "GET",
    endpoints.INSTRUCTOR_COURSES_API,
    null,
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}

export async function createSection(sectionName, courseId, token) {
  const result = await apiConnector(
    "POST",
    endpoints.SECTION_CREATE_API,
    { sectionName, courseId },
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}

export async function updateSection(sectionName, sectionId, courseId, token) {
  const result = await apiConnector(
    "POST",
    endpoints.SECTION_UPDATE_API,
    { sectionName, sectionId, courseId },
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}

export async function deleteSection(sectionId, courseId, token) {
  const result = await apiConnector(
    "POST",
    endpoints.SECTION_DELETE_API,
    { sectionId, courseId },
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}

export async function createSubSection(formData, token) {
  const result = await apiConnector(
    "POST",
    endpoints.SUBSECTION_CREATE_API,
    formData,
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}

export async function updateSubSection(formData, token) {
  const result = await apiConnector(
    "POST",
    endpoints.SUBSECTION_UPDATE_API,
    formData,
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}

export async function deleteSubSection(subSectionId, sectionId, token) {
  const result = await apiConnector(
    "POST",
    endpoints.SUBSECTION_DELETE_API,
    { subSectionId, sectionId },
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}
