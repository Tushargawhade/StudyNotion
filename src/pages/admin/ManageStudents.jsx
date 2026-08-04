import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchAllStudents,
  toggleStudentStatus,
} from "../../services/operations/adminAPI";
import Spinner from "../../components/common/Spinner";

function ManageStudents() {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      const data = await fetchAllStudents(token);
      setStudents(data || []);
    } catch (error) {
      toast.error(error.message || "Could not load students");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleStatus = async (studentId, active) => {
    setBusyId(studentId);
    try {
      await toggleStudentStatus(studentId, active, token);
      await load();
    } catch (error) {
      toast.error(error.message || "Could not update student status");
    }
    setBusyId(null);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-richblack-5">
        Manage Students
      </h1>

      {students.length === 0 ? (
        <p className="text-sm text-richblack-300">No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-richblack-700 text-left text-sm">
            <thead>
              <tr className="text-richblack-200">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Enrolled Courses</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-richblack-700">
              {students.map((student) => (
                <tr key={student._id} className="text-richblack-100">
                  <td className="flex items-center gap-2 px-4 py-3">
                    <img
                      src={student.image}
                      alt={student.firstName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="px-4 py-3">{student.email}</td>
                  <td className="px-4 py-3">{student.courseCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        student.active
                          ? "bg-blue-5 text-blue-600"
                          : "bg-pink-200 text-pink-25"
                      }`}
                    >
                      {student.active ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {student.active ? (
                      <button
                        onClick={() => handleStatus(student._id, false)}
                        disabled={busyId === student._id}
                        className="rounded-md border border-pink-200/50 px-3 py-1.5 text-xs font-semibold text-pink-200 hover:bg-pink-200 hover:text-pink-25 disabled:opacity-50"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatus(student._id, true)}
                        disabled={busyId === student._id}
                        className="rounded-md bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-richblack-900 hover:bg-yellow-25 disabled:opacity-50"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageStudents;
