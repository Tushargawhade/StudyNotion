import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { HiOutlineArrowLeft } from "react-icons/hi";

import { signUp } from "../../../services/operations/authAPI";

function OtpForm() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signupData, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, [signupData, navigate]);

  const handleOnChange = (e, index) => {
    const { value } = e.target;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setActiveOtpIndex(value ? index + 1 : index - 1);
  };

  const handleOnKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      setActiveOtpIndex(index === 0 ? 0 : index - 1);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .trim()
      .split("")
      .filter((char) => !isNaN(char))
      .slice(0, 6);
    if (pasted.length) {
      setOtp(pasted);
      setActiveOtpIndex(Math.min(pasted.length, 5));
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the 6 digit OTP");
      return;
    }
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otpString,
        navigate
      )
    );
  };

  if (!signupData) return null;

  return (
    <div>
      <p className="text-richblack-5">
        Verification code sent to{" "}
        <span className="font-medium text-blue-100">{signupData.email}</span>
      </p>
      <form onSubmit={handleOnSubmit} className="mt-6 w-full">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={index === activeOtpIndex ? inputRef : null}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOnChange(e, index)}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
              onPaste={handlePaste}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="aspect-square w-12 rounded-[0.5rem] bg-richblack-800 text-center text-lg font-semibold text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-50"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-[8px] bg-yellow-50 py-[12px] font-medium text-richblack-900 transition-all duration-200 hover:bg-yellow-25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <Link to="/login" className="flex items-center gap-x-2 text-richblack-5">
          <HiOutlineArrowLeft />
          Back to Login
        </Link>
        <button
          onClick={() => navigate("/signup")}
          className="text-blue-100"
        >
          Re-enter details
        </button>
      </div>
    </div>
  );
}

export default OtpForm;
