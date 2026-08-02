import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const {
  GET_USER_DETAILS_API,
  GET_ENROLLED_COURSES_API,
  INSTRUCTOR_DASHBOARD_API,
} = endpoints;

export async function getUserDetails(token) {
  const result = await apiConnector(
    "GET",
    GET_USER_DETAILS_API,
    null,
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}

export async function getUserEnrolledCourses(token) {
  const result = await apiConnector(
    "GET",
    GET_ENROLLED_COURSES_API,
    null,
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}

export async function getInstructorData(token) {
  const result = await apiConnector(
    "GET",
    INSTRUCTOR_DASHBOARD_API,
    null,
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}
