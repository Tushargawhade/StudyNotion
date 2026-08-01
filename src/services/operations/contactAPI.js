import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const { CONTACT_API } = endpoints;

export async function submitContact(formData, setLoading) {
  setLoading(true);
  try {
    const response = await apiConnector("POST", CONTACT_API, formData);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Message sent successfully");
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Could not send message");
    return false;
  } finally {
    setLoading(false);
  }
}
