import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { DEMO_ENROLL_API } from "../apis";

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
