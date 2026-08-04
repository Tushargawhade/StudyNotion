import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineCaretDown } from "react-icons/ai";
import { FiChevronRight, FiEdit3, FiLogOut, FiPlayCircle } from "react-icons/fi";
import { FaCircleUser } from "react-icons/fa6";

import { logout } from "../../../services/operations/authAPI";
import ConfirmationModal from "../../common/ConfirmationModal";
import useOnClickOutside from "../../../hooks/useOnClickOutside";

function ProfileDropDown() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  const seed = user ? `${user.firstName} ${user.lastName}` : "User";

  const menuItemClasses =
    "group/item flex w-full cursor-pointer items-center gap-3 px-3.5 py-2 text-sm font-medium text-richblack-100 transition-colors duration-150 hover:bg-richblack-700 hover:text-richblack-5";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-full p-1 pr-1 transition-colors duration-200 ${
          open ? "bg-richblack-800" : "hover:bg-richblack-800"
        }`}
      >
        <img
          src={
            user?.image ||
            `https://api.dicebear.com/5.x/initials/svg?seed=${seed}`
          }
          alt="profile"
          className="aspect-square w-8 rounded-full object-cover"
        />
        <AiOutlineCaretDown
          className={`text-sm text-richblack-100 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="dropdown-pop absolute -right-1 top-[calc(100%+8px)] z-[1000] w-52 overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800/95 shadow-2xl shadow-black/50 backdrop-blur-sm"
        >
          <div className="border-b border-richblack-700 bg-richblack-900 px-3.5 py-2.5">
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.image ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${seed}`
                }
                alt="profile"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-richblack-5">
                  {user ? `${user.firstName} ${user.lastName}` : "User"}
                </p>
                <p className="truncate text-xs text-richblack-300">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="py-1.5">
            <div
              onClick={() => {
                setOpen(false);
                navigate("/dashboard/my-learning");
              }}
              className={menuItemClasses}
            >
              <FiPlayCircle className="text-lg text-richblack-200" />
              <span>My Learning</span>
              <FiChevronRight className="ml-auto text-richblack-400 opacity-0 transition-opacity group-hover/item:opacity-100" />
            </div>
            <div
              onClick={() => {
                setOpen(false);
                navigate("/dashboard/my-profile");
              }}
              className={menuItemClasses}
            >
              <FaCircleUser className="text-lg text-richblack-200" />
              <span>My Profile</span>
              <FiChevronRight className="ml-auto text-richblack-400 opacity-0 transition-opacity group-hover/item:opacity-100" />
            </div>
            <div
              onClick={() => {
                setOpen(false);
                navigate("/dashboard/settings");
              }}
              className={menuItemClasses}
            >
              <FiEdit3 className="text-lg text-richblack-200" />
              <span>Settings</span>
              <FiChevronRight className="ml-auto text-richblack-400 opacity-0 transition-opacity group-hover/item:opacity-100" />
            </div>
          </div>

          <div className="border-t border-richblack-700 py-1.5">
            <div
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
              className={`${menuItemClasses} hover:bg-pink-900/20 hover:text-pink-500`}
            >
              <FiLogOut className="text-lg text-pink-500" />
              <span>Logout</span>
              <FiChevronRight className="ml-auto text-pink-500/60 opacity-0 transition-opacity group-hover/item:opacity-100" />
            </div>
          </div>
        </div>
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}

export default ProfileDropDown;
