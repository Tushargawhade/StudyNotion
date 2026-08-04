import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const { UPDATE_PROFILE_API, UPDATE_DISPLAY_PICTURE_API, CHANGE_PASSWORD_API, DELETE_ACCOUNT_API } =
  endpoints;

export async function deleteAccount(token) {
  const result = await apiConnector("DELETE", DELETE_ACCOUNT_API, null, {
    Authorization: `Bearer ${token}`,
  });
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  toast.success("Account deleted successfully");
  return result.data;
}

export async function updateProfile(token, formData) {
  const result = await apiConnector(
    "PUT",
    UPDATE_PROFILE_API,
    formData,
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  toast.success("Profile updated successfully");
  return result.data.updatedDetails;
}

export async function updateDisplayPicture(token, formData) {
  const result = await apiConnector(
    "PUT",
    UPDATE_DISPLAY_PICTURE_API,
    formData,
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  toast.success("Display picture updated successfully");
  return result.data.data;
}

export async function changePassword(token, formData) {
  const result = await apiConnector(
    "POST",
    CHANGE_PASSWORD_API,
    formData,
    { Authorization: `Bearer ${token}` }
  );
  if (!result.data.success) {
    throw new Error(result.data.message);
  }
  toast.success("Password changed successfully");
  return result.data;
}
