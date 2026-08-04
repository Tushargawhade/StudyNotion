import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { fetchAdminStats } from "../../services/operations/adminAPI";
import Spinner from "../../components/common/Spinner";

function AdminDashboard() {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAdminStats(token);
        setStats(data);
      } catch (error) {
        toast.error(error.message || "Could not load admin stats");
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return <Spinner />;
  }

  const cards = [
    { label: "Total Students", value: stats?.totalStudents || 0 },
    { label: "Total Instructors", value: stats?.totalInstructors || 0 },
    { label: "Pending Approvals", value: stats?.pendingInstructors || 0 },
    { label: "Total Courses", value: stats?.totalCourses || 0 },
    { label: "Total Categories", value: stats?.totalCategories || 0 },
    { label: "Total Enrollments", value: stats?.totalEnrollments || 0 },
    {
      label: "Total Revenue",
      value:
        "₹" +
        (stats?.totalRevenue || 0).toLocaleString("en-IN"),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-richblack-5">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-md border border-richblack-700 bg-richblack-800 p-6 text-center"
          >
            <p className="text-3xl font-bold text-yellow-50">{card.value}</p>
            <p className="mt-1 text-sm text-richblack-200">{card.label}</p>
          </div>
        ))}
      </div>

      {stats?.pendingInstructors > 0 && (
        <div className="rounded-md border border-yellow-50/40 bg-richblack-800 p-4 text-sm text-richblack-100">
          {stats.pendingInstructors} instructor(s) are waiting for approval.{" "}
          <a
            href="/dashboard/admin/instructors"
            className="font-semibold text-yellow-50 hover:underline"
          >
            Review now
          </a>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
