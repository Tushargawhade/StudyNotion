import React from "react";
import { Link } from "react-router-dom";
import {
  FiAward,
  FiBookOpen,
  FiGlobe,
  FiUsers,
  FiVideo,
} from "react-icons/fi";
import CTAButton from "../components/core/homepage/Button";

function About() {
  const stats = [
    { icon: FiUsers, label: "Students", value: "50K+" },
    { icon: FiBookOpen, label: "Courses", value: "100+" },
    { icon: FiVideo, label: "Lectures", value: "10K+" },
    { icon: FiGlobe, label: "Countries", value: "40+" },
  ];

  return (
    <div className="text-richblack-25">
      <section className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center gap-5 py-16 text-center">
        <p className="text-sm font-semibold text-yellow-50 uppercase tracking-widest">
          About Us
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Learn without limits with{" "}
          <span className="bg-gradient-to-r from-yellow-50 via-caribbeangreen-200 to-blue-200 bg-clip-text text-transparent">
            StudyVerse
          </span>
        </h1>
        <p className="w-[80%] text-richblack-200">
          We are on a mission to make world-class technical education accessible
          to everyone, everywhere. Our platform brings together expert
          instructors, hands-on projects, and a thriving community of learners.
        </p>
        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <CTAButton active={true} linkto="/catalog">
            Start Learning
          </CTAButton>
          <CTAButton active={false} linkto="/contact">
            Contact Us
          </CTAButton>
        </div>
      </section>

      <section className="border-y border-richblack-700 bg-richblack-800">
        <div className="mx-auto grid w-11/12 max-w-maxContent grid-cols-2 gap-8 py-10 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 text-center">
              <stat.icon className="text-3xl text-yellow-50" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-richblack-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-11/12 max-w-maxContent gap-8 py-16 lg:grid-cols-2">
        <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-8">
          <FiAward className="mb-4 text-3xl text-yellow-50" />
          <h2 className="mb-3 text-2xl font-semibold">Our Mission</h2>
          <p className="leading-7 text-richblack-200">
            To empower learners with job-ready skills through high-quality,
            industry-relevant courses taught by seasoned professionals. We
            believe education should be practical, engaging, and available to
            anyone with the drive to learn.
          </p>
        </div>
        <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-8">
          <FiUsers className="mb-4 text-3xl text-yellow-50" />
          <h2 className="mb-3 text-2xl font-semibold">Our Community</h2>
          <p className="leading-7 text-richblack-200">
            With thousands of students and instructors across the globe,
            StudyVerse is more than a course platform — it is a community where
            learners share knowledge, collaborate on projects, and grow their
            careers together.
          </p>
        </div>
      </section>

      <section className="pb-16 text-center">
        <h2 className="text-3xl font-semibold">Ready to get started?</h2>
        <p className="mx-auto mt-3 w-[90%] text-richblack-200 sm:w-[70%]">
          Join StudyVerse today and unlock your potential with courses built
          for real-world success.
        </p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <Link
            to="/signup"
            className="rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 hover:bg-yellow-25"
          >
            Sign Up for Free
          </Link>
          <Link
            to="/catalog"
            className="rounded-md border border-richblack-500 px-6 py-3 font-semibold text-richblack-25 hover:bg-richblack-800"
          >
            Browse Courses
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
