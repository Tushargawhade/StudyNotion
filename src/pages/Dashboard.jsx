import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../components/core/Dashboard/Sidebar";
import Spinner from "../components/common/Spinner";

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (profileLoading || authLoading) {
    return <Spinner />;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-16 bottom-0 z-50 transform transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:transition-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      <div className="flex h-[calc(100vh-4rem)] flex-1 flex-col overflow-auto">
        <div className="flex items-center justify-between border-b border-richblack-700 bg-richblack-900 px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-richblack-25 transition-colors duration-200 hover:text-yellow-50"
            aria-label="Open dashboard menu"
          >
            <FiMenu className="text-2xl" />
          </button>
          <span className="text-sm font-medium text-richblack-200">
            Dashboard
          </span>
          <div className="w-7" />
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
