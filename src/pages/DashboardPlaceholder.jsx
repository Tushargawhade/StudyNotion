import React from "react";
import { useSelector } from "react-redux";

function DashboardPlaceholder({ title }) {
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="rounded-md border border-richblack-700 bg-richblack-800 p-8">
      <h1 className="text-2xl font-semibold text-richblack-5">{title}</h1>
      <p className="mt-3 text-sm text-richblack-200">
        This page is under construction{user ? `, ${user.firstName}` : ""}.
        Check back soon.
      </p>
    </div>
  );
}

export default DashboardPlaceholder;
