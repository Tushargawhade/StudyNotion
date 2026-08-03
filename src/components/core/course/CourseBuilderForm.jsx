import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FiEdit3, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { MdAddCircle } from "react-icons/md";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import {
  createSection,
  deleteSection,
  deleteSubSection,
  updateSection,
} from "../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../slices/courseSlice";
import IconBtn from "../../common/IconBtn";
import ConfirmationModal from "../../common/ConfirmationModal";
import SubSectionModal from "./SubSectionModal";

function CourseBuilderForm() {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addNewSection, setAddNewSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [editSectionName, setEditSectionName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [subSectionModal, setSubSectionModal] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  const inputClass =
    "w-full rounded-lg bg-richblack-700 p-3 text-[14px] text-richblack-5 placeholder:text-richblack-400 border border-richblack-600 outline-none focus:border-yellow-50";

  const handleAddSection = async () => {
    if (!newSectionName.trim()) {
      toast.error("Section name is required");
      return;
    }
    setLoading(true);
    try {
      const updatedCourse = await createSection(
        newSectionName.trim(),
        course._id,
        token
      );
      dispatch(setCourse(updatedCourse));
      setNewSectionName("");
      setAddNewSection(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleUpdateSection = async (sectionId) => {
    if (!newSectionName.trim()) {
      toast.error("Section name is required");
      return;
    }
    setLoading(true);
    try {
      const updatedCourse = await updateSection(
        newSectionName.trim(),
        sectionId,
        course._id,
        token
      );
      dispatch(setCourse(updatedCourse));
      setNewSectionName("");
      setEditSectionName(null);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleDeleteSection = async (sectionId) => {
    setLoading(true);
    try {
      const updatedCourse = await deleteSection(sectionId, course._id, token);
      dispatch(setCourse(updatedCourse));
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
    setConfirmationModal(null);
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    setLoading(true);
    try {
      const section = await deleteSubSection(subSectionId, sectionId, token);
      const updatedContent = course.courseContent.map((s) =>
        s._id === section._id ? section : s
      );
      dispatch(setCourse({ ...course, courseContent: updatedContent }));
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
    setConfirmationModal(null);
  };

  const startEditSection = (section) => {
    setEditSectionName(section._id);
    setNewSectionName(section.sectionName);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-md border border-richblack-700 bg-richblack-900 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={course?.thumbnail}
            alt={course?.courseName}
            className="aspect-video w-32 rounded-md object-cover"
          />
          <div>
            <p className="text-lg font-semibold text-richblack-5">
              {course?.courseName}
            </p>
            <p className="text-sm text-richblack-200">
              {course?.courseDescription}
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(setStep(1))}
          className="rounded-md border border-yellow-50 bg-transparent px-4 py-2 text-sm font-semibold text-yellow-50 hover:bg-yellow-50 hover:text-richblack-900"
        >
          Edit Course Information
        </button>
      </div>

      <div className="space-y-4 rounded-md border border-richblack-700 bg-richblack-900 p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">
            Course Builder
          </p>
          {addNewSection ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                placeholder="Enter section name"
                className={inputClass}
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSection();
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddSection}
                  disabled={loading}
                  className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setAddNewSection(false);
                    setNewSectionName("");
                  }}
                  className="rounded-md bg-richblack-700 px-4 py-2 text-sm font-semibold text-richblack-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddNewSection(true)}
              className="flex items-center gap-2 rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900"
            >
              <MdAddCircle className="text-lg" />
              Add Section
            </button>
          )}
        </div>

        <div className="space-y-4">
          {course?.courseContent?.map((section) => (
            <div
              key={section._id}
              className="rounded-md border border-richblack-700 bg-richblack-800"
            >
              <div className="flex items-center justify-between p-4">
                {editSectionName === section._id ? (
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      placeholder="Enter section name"
                      className={inputClass}
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateSection(section._id)}
                        disabled={loading}
                        className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditSectionName(null);
                          setNewSectionName("");
                        }}
                        className="rounded-md bg-richblack-700 px-4 py-2 text-sm font-semibold text-richblack-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === section._id
                          ? null
                          : section._id
                      )
                    }
                    className="flex items-center gap-2 text-lg font-medium text-richblack-5"
                  >
                    <FaChevronDown
                      className={`transition-all ${
                        expandedSection === section._id ? "rotate-180" : ""
                      }`}
                    />
                    <span>{section.sectionName}</span>
                  </button>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => startEditSection(section)}
                    className="text-lg text-richblack-200 hover:text-yellow-50"
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Delete this section?",
                        text2: "All lectures in this section will be deleted.",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDeleteSection(section._id),
                        btn2Handler: () => setConfirmationModal(null),
                      })
                    }
                    className="text-lg text-richblack-200 hover:text-pink-200"
                  >
                    <FiTrash2 />
                  </button>
                  <button
                    onClick={() =>
                      setSubSectionModal({
                        type: "add",
                        sectionId: section._id,
                      })
                    }
                    className="flex items-center gap-1 text-sm font-medium text-yellow-50 hover:text-yellow-25"
                  >
                    <FiPlusCircle className="text-lg" />
                    Add Lecture
                  </button>
                </div>
              </div>

              {expandedSection === section._id && (
                <div className="border-t border-richblack-700 p-4">
                  {section.subSection?.length === 0 ? (
                    <p className="text-sm text-richblack-200">
                      No lectures added yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {section.subSection.map((subSection) => (
                        <div
                          key={subSection._id}
                          className="flex items-center justify-between rounded-md bg-richblack-900 px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <AiOutlineVideoCamera className="text-lg text-richblack-200" />
                            <div>
                              <p className="text-sm font-medium text-richblack-5">
                                {subSection.title}
                              </p>
                              <p className="text-xs text-richblack-300">
                                {subSection.timeDuration
                                  ? `${subSection.timeDuration} sec`
                                  : "No duration"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                setSubSectionModal({
                                  type: "edit",
                                  sectionId: section._id,
                                  subSectionId: subSection._id,
                                  title: subSection.title,
                                  description: subSection.description,
                                })
                              }
                              className="text-lg text-richblack-200 hover:text-yellow-50"
                            >
                              <FiEdit3 />
                            </button>
                            <button
                              onClick={() =>
                                setConfirmationModal({
                                  text1: "Delete this lecture?",
                                  text2: "This lecture will be permanently deleted.",
                                  btn1Text: "Delete",
                                  btn2Text: "Cancel",
                                  btn1Handler: () =>
                                    handleDeleteSubSection(
                                      subSection._id,
                                      section._id
                                    ),
                                  btn2Handler: () => setConfirmationModal(null),
                                })
                              }
                              className="text-lg text-richblack-200 hover:text-pink-200"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {course?.courseContent?.length === 0 && (
          <p className="text-sm text-richblack-300">
            No sections added yet. Add a section to get started.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-x-4">
        <IconBtn
          text="Back"
          onclick={() => dispatch(setStep(1))}
          outline
        />
        <IconBtn
          text="Save & Next"
          onclick={() => dispatch(setStep(3))}
        />
      </div>

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
      {subSectionModal && (
        <SubSectionModal
          modalData={subSectionModal}
          setModalData={setSubSectionModal}
        />
      )}
    </div>
  );
}

export default CourseBuilderForm;
