import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import {
  COURSE_DETAILS_API,
  RATING_API,
  REVIEWS_API,
  GET_CATEGORY_DETAILS_API,
  categories,
} from "../apis";

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
