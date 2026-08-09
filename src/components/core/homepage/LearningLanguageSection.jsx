import React from "react";
import { FiCheckCircle, FiPlayCircle, FiSearch } from "react-icons/fi";
import HighlightedText from "./HighlightedText";
import CTAButton from "./Button";

const steps = [
  {
    icon: FiSearch,
    step: "01",
    heading: "Explore Courses",
    description:
      "Browse a growing catalog of courses, compare ratings and find the one that fits your goals.",
  },
  {
    icon: FiPlayCircle,
    step: "02",
    heading: "Enroll & Start Learning",
    description:
      "Enroll in seconds and learn at your own pace with expert-led video lectures.",
  },
  {
    icon: FiCheckCircle,
    step: "03",
    heading: "Track Your Progress",
    description:
      "Mark lectures complete, watch your progress grow and finish courses with confidence.",
  },
];

const LearningLanguageSection = () => {
  return (
    <div className="mb-16 mt-[120px]">
      <div className="flex flex-col items-center gap-5">
        <div className="text-center text-4xl font-semibold">
          Your all-in-one
          <HighlightedText text={"learning platform"} />
        </div>

        <div className="mx-auto w-[80%] text-center text-base font-medium text-richblack-600">
          From browsing the catalog to tracking your progress — everything you
          need to learn effectively in one place.
        </div>

        <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="flex flex-col items-start gap-4 rounded-xl border border-richblack-300 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-richblack-800 text-2xl text-yellow-50">
                    <Icon />
                  </span>
                  <span className="text-3xl font-bold text-richblack-200">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-richblack-5">
                  {item.heading}
                </h3>
                <p className="text-sm leading-6 text-richblack-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="w-fit">
          <CTAButton active={true} linkto={"/catalog"}>
            Explore Courses
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
