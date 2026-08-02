import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import { FiEdit3 } from "react-icons/fi";
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

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-x-1"
      >
        <img
          src={
            user?.image ||
            `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`
          }
          alt="profile"
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </button>

      {open && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-[118%] z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
        >
          <div
            onClick={() => {
              setOpen(false);
              navigate("/dashboard/my-profile");
            }}
            className="flex w-full cursor-pointer items-center gap-x-4 px-[12px] py-[10px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
          >
            <FaCircleUser className="text-lg" />
            My Profile
          </div>
          <div
            onClick={() => {
              setOpen(false);
              navigate("/dashboard/settings");
            }}
            className="flex w-full cursor-pointer items-center gap-x-4 px-[12px] py-[10px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
          >
            <FiEdit3 className="text-lg" />
            Settings
          </div>
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
            className="flex w-full cursor-pointer items-center gap-x-4 px-[12px] py-[10px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-pink-200"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}

export default ProfileDropDown;
