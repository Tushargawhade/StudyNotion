import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut as DoughnutChart } from "react-chartjs-2";
import { fetchInstructorCourses } from "../services/operations/courseDetailsAPI";
import Spinner from "../components/common/Spinner";

ChartJS.register(ArcElement, Tooltip, Legend);

const SLICE_COLORS = [
  "#2563EB",
  "#0EA5E9",
  "#1D4ED8",
  "#0284C7",
  "#6366F1",
  "#38BDF8",
  "#0C4A6E",
  "#60A5FA",
];

function InstructorDashboard() {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const courseList = await fetchInstructorCourses(token);
        setCourses(courseList || []);
      } catch (error) {
        toast.error(error.message || "Could not load dashboard data");
      }
      setLoading(false);
    })();
  }, [token]);

  if (loading) {
    return <Spinner />;
  }

  const totalStudentsEnrolled = courses.reduce(
    (acc, c) => acc + (c.studentsEnrolled?.length || 0),
    0
  );

  const totalRevenue = courses.reduce(
    (acc, c) => acc + (c.price || 0) * (c.studentsEnrolled?.length || 0),
    0
  );

  const formatCurrency = (value) =>
    "₹" + value.toLocaleString("en-IN");

  const chartData = {
    labels: courses.map((c) =>
      c.courseName.length > 18 ? c.courseName.slice(0, 18) + "…" : c.courseName
    ),
    datasets: [
      {
        data: courses.map((c) => c.studentsEnrolled?.length || 0),
        backgroundColor: SLICE_COLORS,
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#475569",
          boxWidth: 12,
          padding: 14,
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-richblack-5">
        Instructor Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-richblack-700 bg-richblack-800 p-6 text-center">
          <p className="text-3xl font-bold text-yellow-50">{courses.length}</p>
          <p className="mt-1 text-sm text-richblack-200">Total Courses</p>
        </div>
        <div className="rounded-md border border-richblack-700 bg-richblack-800 p-6 text-center">
          <p className="text-3xl font-bold text-yellow-50">
            {totalStudentsEnrolled}
          </p>
          <p className="mt-1 text-sm text-richblack-200">Students Enrolled</p>
        </div>
        <div className="rounded-md border border-richblack-700 bg-richblack-800 p-6 text-center">
          <p className="text-3xl font-bold text-yellow-50">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="mt-1 text-sm text-richblack-200">Total Revenue</p>
        </div>
      </div>

      <div className="rounded-md border border-richblack-700 bg-richblack-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-richblack-5">
          Students per Course
        </h2>
        {courses.length > 0 ? (
          <div className="relative mx-auto h-72 w-full max-w-md">
            <DoughnutChart data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-sm text-richblack-300">No courses created yet.</p>
        )}
      </div>

      {courses.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-richblack-700 bg-richblack-800">
          <table className="min-w-full divide-y divide-richblack-700 text-left text-sm">
            <thead>
              <tr className="text-richblack-200">
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-richblack-700">
              {courses.map((course) => (
                <tr key={course._id} className="text-richblack-100">
                  <td className="max-w-xs truncate px-4 py-3 font-medium">
                    {course.courseName}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(course.price || 0)}
                  </td>
                  <td className="px-4 py-3">
                    {course.studentsEnrolled?.length || 0}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(
                      (course.price || 0) * (course.studentsEnrolled?.length || 0)
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

export default InstructorDashboard;
