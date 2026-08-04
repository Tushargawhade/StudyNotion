import React, { useState } from "react";
import CourseAccordionBar from "./CourseAccordionBar";

function CourseAccordion({ course, onLectureClick }) {
  const [activeSection, setActiveSection] = useState(
    course?.courseContent?.[0]?._id || null
  );

  return (
    <div className="space-y-2">
      {course?.courseContent?.map((section, idx) => (
        <CourseAccordionBar
          key={section._id}
          section={section}
          sectionNo={idx + 1}
          isActive={activeSection === section._id}
          onClick={() =>
            setActiveSection(
              activeSection === section._id ? null : section._id
            )
          }
          onLectureClick={onLectureClick}
        />
      ))}
    </div>
  );
}

export default CourseAccordion;
