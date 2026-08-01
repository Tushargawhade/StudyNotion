import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import HighlightedText from "../components/core/homepage/HighlightedText";
import { submitContact } from "../services/operations/contactAPI";
import Footer from "../components/common/Footer";

function Contact() {
  const { user } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user ? user.email : "",
    phoneNumber: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const { name, email, phoneNumber, subject, message } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const success = await submitContact(formData, setLoading);
    if (success) {
      setFormData({
        name: user ? `${user.firstName} ${user.lastName}` : "",
        email: user ? user.email : "",
        phoneNumber: "",
        subject: "",
        message: "",
      });
    }
  };

  const inputStyle = {
    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
  };

  const inputClass =
    "w-full rounded-[0.5rem] bg-richblack-900 p-[12px] text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-50";

  return (
    <div>
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-12 py-14 text-white lg:flex-row">
        {/* left info */}
        <div className="flex flex-col gap-6 lg:w-[40%]">
          <h1 className="text-4xl font-semibold">
            Get in <HighlightedText text={"Touch"} /> with us
          </h1>

          <p className="text-richblack-400">
            Have a question or need assistance? Fill out the form below and our
            team will get back to you as soon as possible.
          </p>

          <div className="flex flex-col gap-4 text-richblack-100">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-yellow-50" />
              <p>support@studynotion.in</p>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-yellow-50" />
              <p>+91 9999999999</p>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-yellow-50" />
              <p>India</p>
            </div>
          </div>
        </div>

        {/* form */}
        <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-8 lg:w-[60%]">
          <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Name <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleOnChange}
                  placeholder="Enter your name"
                  style={inputStyle}
                  className={inputClass}
                />
              </label>
              <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleOnChange}
                  placeholder="Enter your email"
                  style={inputStyle}
                  className={inputClass}
                />
              </label>
              <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Phone Number
                </p>
                <input
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handleOnChange}
                  placeholder="Enter your phone number"
                  style={inputStyle}
                  className={inputClass}
                />
              </label>
              <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Subject
                </p>
                <input
                  type="text"
                  name="subject"
                  value={subject}
                  onChange={handleOnChange}
                  placeholder="Enter subject"
                  style={inputStyle}
                  className={inputClass}
                />
              </label>
            </div>

            <label className="w-full">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Message <sup className="text-pink-200">*</sup>
              </p>
              <textarea
                required
                rows={5}
                name="message"
                value={message}
                onChange={handleOnChange}
                placeholder="Write your message here..."
                style={inputStyle}
                className={`${inputClass} resize-none`}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900 transition-all duration-200 hover:bg-yellow-25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Contact;
