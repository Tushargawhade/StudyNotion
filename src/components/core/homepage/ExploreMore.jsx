import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { FiBookOpen } from "react-icons/fi";
import HighlightedText from "./HighlightedText";

function ExploreMore({ courses }) {
  const categories = React.useMemo(() => {
    const groups = {};
    (courses || []).forEach((course) => {
      const name = course.category?.name || "Uncategorized";
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push(course);
    });
    return Object.entries(groups)
      .map(([name, list]) => ({ name, courses: list }))
      .sort((a, b) => b.courses.length - a.courses.length)
      .slice(0, 3);
  }, [courses]);

  return (
    <div className="w-full py-8 ">
      <div className="text-center">
        <h2 className="text-4xl font-semibold">
          Explore by <HighlightedText text="Category" />
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base font-medium text-richblack-300">
          Jump into a topic that interests you and start building real skills
          with expert-led courses.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const thumbnail = category.courses[0]?.thumbnail;
          return (
            <Link
              to="/catalog"
              key={category.name}
              className="group overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 transition-all duration-300 hover:-translate-y-1 hover:border-richblack-500 hover:shadow-lg hover:shadow-black/40"
            >
              <div className="relative overflow-hidden">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={category.name}
                    className="aspect-video w-full object-cover transition-all duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-richblack-700">
                    <FiBookOpen className="text-4xl text-richblack-400" />
                  </div>
                )}
                <span className="absolute right-2.5 top-2.5 rounded-md bg-yellow-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-richblack-900">
                  {category.courses.length} course
                  {category.courses.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="text-base font-semibold text-richblack-5">
                    {category.name}
                  </h3>
                  {category.courses[0]?.category?.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-richblack-300">
                      {category.courses[0].category.description}
                    </p>
                  )}
                </div>
                <span className="flex items-center gap-2 text-sm font-medium text-yellow-50">
                  Browse
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ExploreMore;
