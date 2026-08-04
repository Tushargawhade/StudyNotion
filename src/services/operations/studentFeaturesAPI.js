import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const { DEMO_ENROLL_API, GET_PURCHASE_HISTORY_API } = endpoints;

export async function enrollCourse(token, courseId) {
  const result = await apiConnector(
    "POST",
    DEMO_ENROLL_API,
    { courseId },
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  toast.success("Enrolled successfully");
  return result.data;
}

export async function getPurchaseHistory(token) {
  const result = await apiConnector("GET", GET_PURCHASE_HISTORY_API, null, {
    Authorization: `Bearer ${token}`,
  });
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  return result.data.data;
}
