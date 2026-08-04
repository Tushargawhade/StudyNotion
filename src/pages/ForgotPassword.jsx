import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { BiMailSend } from "react-icons/bi";

import { getPasswordResetToken } from "../services/operations/authAPI";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      <div className="mx-auto w-11/12 max-w-[450px] py-12">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
          {!emailSent ? "Reset your password" : "Check your email"}
        </h1>
        <p className="mt-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
          {!emailSent
            ? "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery."
            : `We have sent the reset email to ${email}`}
        </p>

        {!emailSent ? (
          <form onSubmit={handleOnSubmit} className="mt-6 w-full">
            <label className="w-full">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Email Address <sup className="text-pink-500">*</sup>
              </p>
              <input
                required
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-50"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-[8px] bg-yellow-50 py-[12px] font-medium text-richblack-900 transition-all duration-200 hover:bg-yellow-25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>
        ) : (
          <div className="mt-8 flex flex-col gap-6">
            <Link
              to="/login"
              className="flex items-center justify-center rounded-[8px] bg-yellow-50 py-[12px] font-medium text-richblack-900 transition-all duration-200 hover:bg-yellow-25"
            >
              <BiMailSend className="mr-2" /> Resend Email
            </Link>
          </div>
        )}

        <Link
          to="/login"
          className="mt-8 flex items-center gap-x-2 text-richblack-5"
        >
          <HiOutlineArrowLeft />
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;

