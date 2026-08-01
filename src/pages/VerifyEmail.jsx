import OtpForm from "../components/core/auth/OtpForm";
import { useSelector } from "react-redux";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";

function VerifyEmail() {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mx-auto flex w-11/12 max-w-[450px] flex-col py-12">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            Verify Email
          </h1>
          <OtpForm />
          <Link
            to="/login"
            className="mt-6 flex items-center gap-x-2 text-richblack-5"
          >
            <HiOutlineArrowLeft />
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
