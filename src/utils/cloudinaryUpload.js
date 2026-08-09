import axios from "axios";
import { toast } from "react-hot-toast";
import { endpoints as apis } from "../services/apis";
import { axiosInstance } from "../services/apiconnector";

const { VIDEO_UPLOAD_SIGNATURE_API } = apis;

async function getVideoUploadSignature(token) {
  try {
    const response = await axiosInstance.get(VIDEO_UPLOAD_SIGNATURE_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error("Could not generate upload signature");
    }

    return response.data.data;
  } catch (error) {
    console.log("GET SIGNATURE ERROR...", error);
    throw error;
  }
}

export async function uploadVideoToCloudinary(file, token, onProgress) {
  try {
    const { cloudName, apiKey, timestamp, folder, publicId, signature } =
      await getVideoUploadSignature(token);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("folder", folder);
    formData.append("public_id", publicId);
    formData.append("resource_type", "video");
    formData.append("signature", signature);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          if (onProgress) onProgress(percent);
        },
      }
    );

    const { secure_url, duration, public_id: uploadedPublicId } = response.data;

    return {
      videoUrl: secure_url,
      duration: Math.round(duration || 0),
      publicId: uploadedPublicId || publicId,
    };
  } catch (error) {
    console.log("CLOUDINARY UPLOAD ERROR...", error);
    toast.error("Video upload failed. Please try again.");
    error.uploadFailed = true;
    throw error;
  }
}
