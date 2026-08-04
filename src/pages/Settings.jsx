import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import {
  changePassword,
  deleteAccount,
  updateProfile,
} from "../services/operations/SettingsAPI";
import { getUserDetails } from "../services/operations/profileAPI";
import { logout } from "../services/operations/authAPI";
import { setUser } from "../slices/profileSlice";
import ConfirmationModal from "../components/common/ConfirmationModal";

function Settings() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    about: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserDetails(token);
        const profile = data?.additionalDetails || {};
        setProfileForm({
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          dateOfBirth: profile?.dateOfBirth || "",
          gender: profile?.gender || "",
          contactNumber: data?.contactNumber || "",
          about: profile?.about || "",
        });
      } catch (error) {
        toast.error(error.message || "Could not load profile");
      }
      setLoading(false);
    })();
  }, [token]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(token, profileForm);
      const freshUser = await getUserDetails(token);
      dispatch(setUser(freshUser));
    } catch (error) {
      toast.error(error.message || "Could not update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await changePassword(token, passwordForm);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      toast.error(error.message || "Could not change password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(token);
      dispatch(setUser(null));
      logout(navigate);
    } catch (error) {
      toast.error(error.message || "Could not delete account");
    }
  };

  const inputStyle =
    "w-full rounded-md bg-richblack-700 p-3 text-sm text-richblack-5 placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-yellow-50";
  const labelStyle = "mb-1 block text-sm text-richblack-200";

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold text-richblack-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-richblack-5">Settings</h1>

      <section className="space-y-5 rounded-md border border-richblack-700 bg-richblack-800 p-6">
        <div className="flex items-center gap-2 text-yellow-50">
          <FiEdit className="text-xl" />
          <h2 className="text-lg font-semibold">Edit Profile</h2>
        </div>
        <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelStyle}>First Name</label>
            <input
              type="text"
              value={profileForm.firstName}
              onChange={(e) =>
                setProfileForm({ ...profileForm, firstName: e.target.value })
              }
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Last Name</label>
            <input
              type="text"
              value={profileForm.lastName}
              onChange={(e) =>
                setProfileForm({ ...profileForm, lastName: e.target.value })
              }
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Date of Birth</label>
            <input
              type="date"
              value={profileForm.dateOfBirth}
              onChange={(e) =>
                setProfileForm({ ...profileForm, dateOfBirth: e.target.value })
              }
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Gender</label>
            <select
              value={profileForm.gender}
              onChange={(e) =>
                setProfileForm({ ...profileForm, gender: e.target.value })
              }
              className={inputStyle}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className={labelStyle}>Contact Number</label>
            <input
              type="tel"
              value={profileForm.contactNumber}
              onChange={(e) =>
                setProfileForm({
                  ...profileForm,
                  contactNumber: e.target.value,
                })
              }
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>About</label>
            <input
              type="text"
              value={profileForm.about}
              onChange={(e) =>
                setProfileForm({ ...profileForm, about: e.target.value })
              }
              className={inputStyle}
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full rounded-md bg-yellow-50 py-2 font-semibold text-richblack-900 hover:bg-yellow-25 sm:w-auto sm:px-6"
            >
              Save
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-5 rounded-md border border-richblack-700 bg-richblack-800 p-6">
        <div className="flex items-center gap-2 text-yellow-50">
          <RiLockPasswordLine className="text-xl" />
          <h2 className="text-lg font-semibold">Change Password</h2>
        </div>
        <form
          onSubmit={handlePasswordSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div>
            <label className={labelStyle}>Current Password</label>
            <input
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
              }
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmNewPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmNewPassword: e.target.value,
                })
              }
              className={inputStyle}
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full rounded-md bg-yellow-50 py-2 font-semibold text-richblack-900 hover:bg-yellow-25 sm:w-auto sm:px-6"
            >
              Update Password
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-md border border-richblack-700 bg-richblack-800 p-6">
        <div className="flex items-center gap-2 text-pink-500">
          <FiTrash2 className="text-xl" />
          <h2 className="text-lg font-semibold">Delete Account</h2>
        </div>
        <p className="mt-2 mb-4 text-sm text-richblack-300">
          This action is irreversible. All your data will be permanently
          removed.
        </p>
        <button
          onClick={() =>
            setConfirmationModal({
              text1: "Delete your account?",
              text2: "Your account and all associated data will be deleted permanently.",
              btn1Text: "Delete",
              btn2Text: "Cancel",
              btn1Handler: handleDeleteAccount,
              btn2Handler: () => setConfirmationModal(null),
            })
          }
          className="rounded-md bg-pink-700 px-6 py-2 font-semibold text-white hover:bg-pink-600"
        >
          Delete Account
        </button>
      </section>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}

export default Settings;

