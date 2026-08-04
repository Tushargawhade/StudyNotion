import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchAllInstructors,
  updateInstructorApproval,
} from "../../services/operations/adminAPI";
import Spinner from "../../components/common/Spinner";

function ManageInstructors() {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      const data = await fetchAllInstructors(token);
      setInstructors(data || []);
    } catch (error) {
      toast.error(error.message || "Could not load instructors");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleApproval = async (instructorId, approved) => {
    setBusyId(instructorId);
    try {
      await updateInstructorApproval(instructorId, approved, token);
      await load();
    } catch (error) {
      toast.error(error.message || "Could not update approval");
    }
    setBusyId(null);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-richblack-5">
        Manage Instructors
      </h1>

      {instructors.length === 0 ? (
        <p className="text-sm text-richblack-300">No instructors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-richblack-700 text-left text-sm">
            <thead>
              <tr className="text-richblack-200">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Courses</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-richblack-700">
              {instructors.map((instructor) => (
                <tr key={instructor._id} className="text-richblack-100">
                  <td className="flex items-center gap-2 px-4 py-3">
                    <img
                      src={instructor.image}
                      alt={instructor.firstName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    {instructor.firstName} {instructor.lastName}
                  </td>
                  <td className="px-4 py-3">{instructor.email}</td>
                  <td className="px-4 py-3">{instructor.courseCount}</td>
                  <td className="px-4 py-3">{instructor.studentCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        instructor.approved
                          ? "bg-blue-5 text-blue-600"
                          : "bg-pink-200 text-pink-25"
                      }`}
                    >
                      {instructor.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {instructor.approved ? (
                      <button
                        onClick={() => handleApproval(instructor._id, false)}
                        disabled={busyId === instructor._id}
                        className="rounded-md border border-pink-200/50 px-3 py-1.5 text-xs font-semibold text-pink-200 hover:bg-pink-200 hover:text-pink-25 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApproval(instructor._id, true)}
                        disabled={busyId === instructor._id}
                        className="rounded-md bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-richblack-900 hover:bg-yellow-25 disabled:opacity-50"
                      >
                        Approve
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

export default ManageInstructors;
