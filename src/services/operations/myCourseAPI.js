import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const { FULL_COURSE_DETAILS_API, UPDATE_COURSE_PROGRESS_API } = endpoints;

export async function getFullCourseDetails(courseId, token) {
  const result = await apiConnector(
    "POST",
    FULL_COURSE_DETAILS_API,
    { courseId },
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}

export async function updateCourseProgress(
  token,
  courseId,
  subsectionId,
  markIncomplete = false
) {
  const result = await apiConnector(
    "POST",
    UPDATE_COURSE_PROGRESS_API,
    { courseId, subsectionId, markIncomplete },
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    toast.error(result.data.message);
    return null;
  }
  return result.data;
}
