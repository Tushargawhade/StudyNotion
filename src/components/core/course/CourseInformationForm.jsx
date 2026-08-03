import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { AiOutlineUpload } from "react-icons/ai";
import IconBtn from "../../common/IconBtn";
import {
  createCourse,
  editCourse,
  fetchCourseCategories,
} from "../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../slices/courseSlice";

function CourseInformationForm() {
  const { course, editCourse: isEdit } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    (async () => {
      const categories = await fetchCourseCategories();
      if (categories?.length > 0) {
        setCourseCategories(categories);
      }
    })();
  }, []);

  useEffect(() => {
    if (isEdit && course) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue(
        "courseCategory",
        typeof course.category === "object"
          ? course.category._id
          : course.category
      );
      setValue("instructorBenefits", course.whatYouWillLearn);
      setValue(
        "courseIntroduction",
        Array.isArray(course.instructions)
          ? course.instructions.join(", ")
          : course.instructions
      );
      setTags(course.tag || []);
      setThumbnailPreview(course.thumbnail);
    }
  }, [course, isEdit, setValue]);

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) {
      toast.error("Tag already added");
      return;
    }
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleThumbnail = (files) => {
    if (files.length > 0) {
      setThumbnailFile(files[0]);
      setThumbnailPreview(URL.createObjectURL(files[0]));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleThumbnail,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
  });

  const isFormUpdated = () => {
    if (!isEdit) return true;
    const currentValues = getValues();
    return (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseCategory !==
        (typeof course.category === "object"
          ? course.category._id
          : course.category) ||
      currentValues.instructorBenefits !== course.whatYouWillLearn ||
      currentValues.courseIntroduction !==
        (Array.isArray(course.instructions)
          ? course.instructions.join(", ")
          : course.instructions) ||
      JSON.stringify(tags) !== JSON.stringify(course.tag || []) ||
      thumbnailFile !== null
    );
  };

  const onSubmit = async (data) => {
    if (tags.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }
    if (thumbnailFile === null && !isEdit) {
      toast.error("Please upload a thumbnail");
      return;
    }
    if (isEdit && !isFormUpdated()) {
      toast.error("No changes made to the form");
      return;
    }

    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("category", data.courseCategory);
    formData.append("whatYouWillLearn", data.instructorBenefits);
    formData.append("instructions", data.courseIntroduction);
    formData.append("tag", JSON.stringify(tags));
    if (isEdit) {
      formData.append("courseId", course._id);
    }
    if (thumbnailFile) {
      formData.append("thumbnailImage", thumbnailFile);
    }

    setLoading(true);
    try {
      const result = isEdit
        ? await editCourse(formData, token)
        : await createCourse(formData, token);

      const selectedCategory = courseCategories.find(
        (c) => c._id === data.courseCategory
      );
      dispatch(
        setCourse({
          ...result,
          category: selectedCategory
            ? { _id: selectedCategory._id, name: selectedCategory.name }
            : result.category,
        })
      );
      dispatch(setStep(2));
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
  };

  const inputClass =
    "w-full rounded-lg bg-richblack-700 p-3 text-[14px] text-richblack-5 placeholder:text-richblack-400 border border-richblack-600 outline-none focus:border-yellow-50";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-5 lg:w-1/2">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-richblack-5">
              Course Title <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="courseTitle"
              placeholder="Enter course title"
              className={inputClass}
              {...register("courseTitle", { required: true })}
            />
            {errors.courseTitle && (
              <span className="text-xs text-pink-200">
                Course title is required
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-richblack-5">
              Course Short Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="courseShortDesc"
              placeholder="Enter description"
              rows={4}
              className={inputClass}
              {...register("courseShortDesc", { required: true })}
            />
            {errors.courseShortDesc && (
              <span className="text-xs text-pink-200">
                Course description is required
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-richblack-5">
              Course Price <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="coursePrice"
              type="number"
              placeholder="Enter course price"
              className={inputClass}
              {...register("coursePrice", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors.coursePrice && (
              <span className="text-xs text-pink-200">
                Course price is required
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-richblack-5">
              Course Category <sup className="text-pink-200">*</sup>
            </label>
            <select
              id="courseCategory"
              className={inputClass}
              {...register("courseCategory", { required: true })}
              defaultValue=""
            >
              <option value="" disabled>
                Choose a category
              </option>
              {courseCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.courseCategory && (
              <span className="text-xs text-pink-200">
                Category is required
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-richblack-5">
              Course Tags <sup className="text-pink-200">*</sup>
            </label>
            <div className="flex gap-2">
              <input
                id="courseTags"
                placeholder="Enter tags and press Add"
                className={inputClass}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-lg bg-yellow-50 px-4 font-semibold text-richblack-900"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 rounded-full bg-richblack-700 px-3 py-1 text-sm text-richblack-5"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-richblack-200 hover:text-pink-200"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:w-1/2">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-richblack-5">
              Course Thumbnail <sup className="text-pink-200">*</sup>
            </label>
            <div
              {...getRootProps()}
              className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-richblack-500 bg-richblack-700 p-6 text-center text-richblack-200"
            >
              <input {...getInputProps()} />
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="thumbnail"
                  className="max-h-[200px] rounded-md object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <AiOutlineUpload className="text-3xl" />
                  <p>Drag and drop an image, or click to browse</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-richblack-5">
              Benefits of the Course <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="instructorBenefits"
              placeholder="What will you learn from this course?"
              rows={3}
              className={inputClass}
              {...register("instructorBenefits", { required: true })}
            />
            {errors.instructorBenefits && (
              <span className="text-xs text-pink-200">
                Benefits are required
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-richblack-5">
              Course Instructions <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="courseIntroduction"
              placeholder="Enter course instructions (comma separated)"
              rows={3}
              className={inputClass}
              {...register("courseIntroduction", { required: true })}
            />
            {errors.courseIntroduction && (
              <span className="text-xs text-pink-200">
                Instructions are required
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-4">
        <IconBtn
          type="submit"
          text={isEdit ? "Update & Continue" : "Save & Continue"}
          disabled={loading}
        />
      </div>
    </form>
  );
}

export default CourseInformationForm;
