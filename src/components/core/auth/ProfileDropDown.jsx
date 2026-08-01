import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineCaretDown } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { VscDashboard } from "react-icons/vsc";

import { logout } from "../../../services/operations/authAPI";

function ProfileDropDown() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-x-2 rounded-full"
      >
        <img
          src={
            user?.image ||
            `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName || "User"} ${user?.lastName || ""}`
          }
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover"
        />
        <AiOutlineCaretDown
          className={`text-richblack-25 transition-all duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[999] w-[200px] rounded-md border border-richblack-700 bg-richblack-800 p-3 text-richblack-100 shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/dashboard/my-profile");
            }}
            className="flex w-full items-center gap-x-2 rounded-md px-2 py-2 text-left text-sm transition-all hover:bg-richblack-700 hover:text-richblack-5"
          >
            <VscDashboard className="text-lg" />
            Dashboard
          </button>
          <div className="my-2 h-[1px] bg-richblack-700"></div>
          <button
            onClick={() => {
              setOpen(false);
              dispatch(logout(navigate));
            }}
            className="flex w-full items-center gap-x-2 rounded-md px-2 py-2 text-left text-sm text-pink-100 transition-all hover:bg-richblack-700"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropDown;
