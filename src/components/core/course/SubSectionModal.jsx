import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { AiOutlineUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import {
  createSubSection,
  updateSubSection,
} from "../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../slices/courseSlice";

function SubSectionModal({ modalData, setModalData }) {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isEdit = modalData?.type === "edit";
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isEdit && modalData) {
      setValue("title", modalData.title);
      setValue("description", modalData.description);
    }
  }, [isEdit, modalData, setValue]);

  const handleVideo = (files) => {
    if (files.length > 0) {
      setVideoFile(files[0]);
      setVideoPreview(URL.createObjectURL(files[0]));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleVideo,
    accept: { "video/*": [".mp4", ".mov", ".mkv", ".webm"] },
    maxFiles: 1,
  });

  const updateCourseWithSection = (section) => {
    const updatedContent = course.courseContent.map((s) =>
      s._id === section._id ? section : s
    );
    dispatch(setCourse({ ...course, courseContent: updatedContent }));
  };

  const onSubmit = async (data) => {
    if (isEdit && videoFile === null && !data.title) {
      toast.error("Please make some changes");
      return;
    }
    if (!isEdit && videoFile === null) {
      toast.error("Please upload a video");
      return;
    }

    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (isEdit) {
      formData.append("subSectionId", modalData.subSectionId);
    }
    if (videoFile) {
      formData.append("video", videoFile);
    }

    setLoading(true);
    try {
      const section = isEdit
        ? await updateSubSection(formData, token)
        : await createSubSection(formData, token);
      updateCourseWithSection(section);
      setModalData(null);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
  };

  const inputClass =
    "w-full rounded-lg bg-richblack-700 p-3 text-[14px] text-richblack-5 placeholder:text-richblack-400 border border-richblack-600 outline-none focus:border-yellow-50";

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[550px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-richblack-5">
            {isEdit ? "Edit Lecture" : "Add Lecture"}
          </p>
          <button
            onClick={() => setModalData(null)}
            className="text-2xl text-richblack-200 hover:text-richblack-5"
          >
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-richblack-5">
              Lecture Title <sup className="text-pink-200">*</sup>
            </label>
            <input
              placeholder="Enter lecture title"
              className={inputClass}
              {...register("title", { required: true })}
            />
            {errors.title && (
              <span className="text-xs text-pink-200">
                Title is required
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-richblack-5">
              Lecture Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              placeholder="Enter lecture description"
              rows={3}
              className={inputClass}
              {...register("description", { required: true })}
            />
            {errors.description && (
              <span className="text-xs text-pink-200">
                Description is required
              </span>
            )}
          </div>

          {!isEdit && (
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-richblack-5">
                Lecture Video <sup className="text-pink-200">*</sup>
              </label>
              <div
                {...getRootProps()}
                className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-richblack-500 bg-richblack-700 p-6 text-center text-richblack-200"
              >
                <input {...getInputProps()} />
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    controls
                    className="max-h-[150px] rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <AiOutlineUpload className="text-3xl" />
                    <p>Drag and drop a video, or click to browse</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-x-4 pt-2">
            <button
              type="button"
              onClick={() => setModalData(null)}
              className="rounded-md bg-richblack-200 px-5 py-2 font-semibold text-richblack-900 hover:bg-richblack-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-yellow-50 px-5 py-2 font-semibold text-richblack-900 hover:bg-yellow-25"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubSectionModal;
