import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import {
  VscSignOut,
  VscDashboard,
  VscAccount,
  VscVm,
  VscAdd,
  VscMortarBoard,
  VscHistory,
  VscHeart,
  VscChecklist,
  VscSettingsGear,
} from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";

const iconComponents = {
  VscAccount,
  VscDashboard,
  VscVm,
  VscAdd,
  VscMortarBoard,
  VscHistory,
  VscHeart,
  VscChecklist,
};

function Sidebar() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [confirmationModal, setConfirmationModal] = useState(null);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-800 bg-richblack-900 h-[calc(100vh-4rem)] py-10 overflow-y-auto">
      <div className="flex flex-col gap-2 px-4">
        {sidebarLinks.map((link) => {
          if (link?.type && user?.accountType !== link.type) {
            return null;
          }

          const Icon = iconComponents[link.icon] || VscDashboard;

          return (
            <Link
              to={link.path}
              key={link.id}
              onClick={(e) => {
                if (matchRoute(link.path)) e.preventDefault();
              }}
            >
              <div
                className={`relative px-8 py-2 text-sm font-medium ${
                  matchRoute(link.path)
                    ? "bg-blue-5 text-yellow-50"
                    : "text-richblack-300"
                } transition-all duration-200`}
              >
                <span
                  className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${
                    matchRoute(link.path) ? "opacity-100" : "opacity-0"
                  }`}
                ></span>
                <div className="flex items-center gap-x-2">
                  <Icon className="text-lg" />
                  <span>{link.name}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700"></div>

      <div className="flex flex-col px-4">
        <div className="flex items-center gap-x-2 px-8 py-2 text-sm font-medium text-richblack-300">
          <VscDashboard className="text-lg" />
          <span>
            {user?.firstName} {user?.lastName}
          </span>
        </div>

        <Link
          to="/dashboard/settings"
          onClick={(e) => {
            if (matchRoute("/dashboard/settings")) e.preventDefault();
          }}
          className={`flex items-center gap-x-2 px-8 py-2 text-sm font-medium transition-all ${
            matchRoute("/dashboard/settings")
              ? "bg-blue-5 text-yellow-50"
              : "text-richblack-300 hover:bg-blue-5"
          }`}
        >
          <VscSettingsGear className="text-lg" />
          <span>Settings</span>
        </Link>

        <button
          onClick={() =>
            setConfirmationModal({
              text1: "Are you sure?",
              text2: "You will be logged out of your account.",
              btn1Text: "Logout",
              btn2Text: "Cancel",
              btn1Handler: () => dispatch(logout(navigate)),
              btn2Handler: () => setConfirmationModal(null),
            })
          }
          className="flex items-center gap-x-2 px-8 py-2 text-sm font-medium text-pink-500 hover:bg-blue-5"
        >
          <VscSignOut className="text-lg" />
          <span>Logout</span>
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 flex items-center gap-x-2 px-8 py-2 text-sm font-medium text-richblack-300 hover:bg-blue-5"
        >
          <VscDashboard className="rotate-180 text-lg" />
          <span>Back to Home</span>
        </button>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}

export default Sidebar;

