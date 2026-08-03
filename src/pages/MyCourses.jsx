import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { toast } from "react-hot-toast";
import { FiEdit3, FiTrash2, FiPlus } from "react-icons/fi";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../services/operations/courseDetailsAPI";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Spinner from "../components/common/Spinner";

function MyCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationModal, setConfirmationModal] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchInstructorCourses(token);
        setCourses(data || []);
      } catch (error) {
        toast.error(error.message || "Could not load courses");
      }
      setLoading(false);
    })();
  }, [token]);

  if (loading) {
    return <Spinner />;
  }

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(token, courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (error) {
      toast.error(error.message || "Could not delete course");
    }
    setConfirmationModal(null);
  };

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-richblack-700 bg-richblack-800 p-10 text-center">
        <p className="text-lg font-semibold text-richblack-5">
          You have no courses yet
        </p>
        <button
          onClick={() => navigate("/dashboard/add-course")}
          className="flex items-center gap-2 rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 hover:bg-yellow-25"
        >
          <FiPlus className="text-lg" />
          Add Course
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-richblack-5">My Courses</h1>
        <button
          onClick={() => navigate("/dashboard/add-course")}
          className="flex items-center gap-2 rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 hover:bg-yellow-25"
        >
          <FiPlus className="text-lg" />
          Add Course
        </button>
      </div>

      <Table className="rounded-xl border border-richblack-700 bg-richblack-800">
        <Thead>
          <Tr className="border-b border-richblack-700 text-sm text-richblack-200">
            <Th className="!text-left">Course</Th>
            <Th>Lectures</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses.map((course) => (
            <Tr
              key={course._id}
              className="border-b border-richblack-700 last:border-b-0"
            >
              <Td className="!pl-4">
                <div className="flex items-center gap-3">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-10 w-14 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-richblack-5">
                      {course.courseName}
                    </p>
                    <p className="text-xs text-richblack-300">
                      {course.courseContent?.length || 0} sections
                    </p>
                  </div>
                </div>
              </Td>
              <Td className="text-sm text-richblack-200">
                {course.courseContent?.reduce(
                  (acc, s) => acc + (s.subSection?.length || 0),
                  0
                ) || 0}{" "}
                lectures
              </Td>
              <Td className="text-sm text-richblack-200">
                Rs. {course.price}
              </Td>
              <Td>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/edit-course/${course._id}`, {
                        state: { course },
                      })
                    }
                    className="text-richblack-200 hover:text-yellow-50"
                  >
                    <FiEdit3 className="text-lg" />
                  </button>
                  <button
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Delete this course?",
                        text2: "This action cannot be undone.",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDelete(course._id),
                        btn2Handler: () => setConfirmationModal(null),
                      })
                    }
                    className="text-richblack-200 hover:text-pink-200"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  );
}

export default MyCourses;
