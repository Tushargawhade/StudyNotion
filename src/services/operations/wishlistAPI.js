import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import {
  addToWishlist,
  removeFromWishlist,
  setWishlist,
} from "../../slices/wishlistSlice";

const { WISHLIST_ADD_API, WISHLIST_REMOVE_API, WISHLIST_GET_ALL_API } =
  endpoints;

export async function getWishlist(token, dispatch) {
  const result = await apiConnector("GET", WISHLIST_GET_ALL_API, null, {
    Authorization: `Bearer ${token}`,
  });
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  const courseIds = result.data.data.map((course) => course._id);
  dispatch(setWishlist(courseIds));
  return result.data.data;
}

export async function addCourseToWishlist(token, courseId, dispatch) {
  const result = await apiConnector(
    "POST",
    WISHLIST_ADD_API,
    { courseId },
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  dispatch(addToWishlist(courseId));
  return result.data.data;
}

export async function removeCourseFromWishlist(token, courseId, dispatch) {
  const result = await apiConnector(
    "DELETE",
    WISHLIST_REMOVE_API,
    { courseId },
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  dispatch(removeFromWishlist(courseId));
  return result.data.data;
}
