import React from "react";
import { FaChevronDown, FaVideo } from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi2";
import { convertSecondsToDuration } from "../../../utils/secToDuration";

function CourseAccordionBar({ section, isActive, onClick, sectionNo, onLectureClick }) {
  return (
    <div className="rounded-md border border-richblack-700 bg-richblack-800">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-yellow-50">{sectionNo}.</span>
          <p className="text-sm font-semibold text-richblack-5">
            {section.sectionName}
          </p>
        </div>
        <FaChevronDown
          className={`text-richblack-200 transition-all duration-200 ${
            isActive ? "rotate-180" : ""
          }`}
        />
      </button>

      {isActive && (
        <div className="space-y-2 border-t border-richblack-700 p-4">
          {section.subSection?.length === 0 ? (
            <p className="text-sm text-richblack-300">No lectures yet.</p>
          ) : (
            section.subSection.map((lecture) => (
              <button
                key={lecture._id}
                onClick={() => onLectureClick?.(lecture)}
                className="flex w-full items-center justify-between gap-3 rounded-md bg-richblack-900 px-3 py-2 text-left text-sm hover:bg-richblack-800"
              >
                <div className="flex items-center gap-2 text-richblack-200">
                  <FaVideo className="text-richblack-300" />
                  <span className="text-richblack-5">{lecture.title}</span>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs text-richblack-300">
                  <HiOutlineClock />
                  {convertSecondsToDuration(lecture.timeDuration)}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CourseAccordionBar;
