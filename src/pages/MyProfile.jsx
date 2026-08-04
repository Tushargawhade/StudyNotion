import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiEdit,
  FiHeart,
  FiLayout,
  FiPlayCircle,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";
import IconBtn from "../components/common/IconBtn";

function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  const instructorPanel = [
    {
      id: 1,
      title: "My Courses",
      desc: "Manage and edit your courses",
      icon: FiBookOpen,
      link: "/dashboard/my-courses",
    },
    {
      id: 2,
      title: "Add Course",
      desc: "Create a brand new course",
      icon: FiPlus,
      link: "/dashboard/add-course",
    },
    {
      id: 3,
      title: "Dashboard",
      desc: "Track your course statistics",
      icon: FiLayout,
      link: "/dashboard/instructor",
    },
  ];

  const studentPanel = [
    {
      id: 1,
      title: "Enrolled Courses",
      desc: "Keep learning your courses",
      icon: FiPlayCircle,
      link: "/dashboard/enrolled-courses",
    },
    {
      id: 2,
      title: "Wishlist",
      desc: "View your saved courses",
      icon: FiHeart,
      link: "/dashboard/wishlist",
    },
    {
      id: 3,
      title: "Purchase History",
      desc: "See all your purchases",
      icon: FiShoppingBag,
      link: "/dashboard/purchase-history",
    },
  ];

  const panel = user?.accountType === "Instructor" ? instructorPanel : studentPanel;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.image ||
              `https://api.dicebear.com/5.x/initials/svg?seed=${fullName || "User"}`
            }
            alt={fullName}
            className="h-20 w-20 rounded-full border-2 border-yellow-50/60 object-cover"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-2xl font-semibold text-richblack-5">
                {fullName}
              </p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  user?.accountType === "Instructor"
                    ? "bg-yellow-50 text-richblack-900"
                    : "bg-richblack-700 text-yellow-50"
                }`}
              >
                {user?.accountType}
              </span>
            </div>
            <p className="mt-1 text-sm text-richblack-200">{user?.email}</p>
            {user?.additionalDetails?.about && (
              <p className="mt-1 max-w-xl text-xs leading-5 text-richblack-300 line-clamp-2">
                {user.additionalDetails.about}
              </p>
            )}
          </div>
        </div>
        <IconBtn
          text="Edit"
          onclick={() => navigate("/dashboard/settings")}
          customClasses="self-start sm:self-center"
        >
          <FiEdit className="text-lg" />
        </IconBtn>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-richblack-5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {panel.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.link)}
              className="group flex flex-col items-start gap-3 rounded-xl border border-richblack-700 bg-richblack-800 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-richblack-500 hover:shadow-lg hover:shadow-black/40"
            >
              <div className="flex w-full items-center justify-between">
                <div className="rounded-full bg-richblack-700 p-3 text-yellow-50 transition-all group-hover:bg-yellow-50 group-hover:text-richblack-900">
                  <item.icon className="text-xl" />
                </div>
                <FiArrowRight className="text-lg text-richblack-400 transition-all group-hover:translate-x-1 group-hover:text-yellow-50" />
              </div>
              <p className="font-semibold text-richblack-5">{item.title}</p>
              <p className="text-sm text-richblack-300">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
