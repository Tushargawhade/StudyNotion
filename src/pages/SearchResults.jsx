import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { searchCourses } from "../services/operations/courseDetailsAPI";
import CourseCard from "../components/core/course/CourseCard";
import Spinner from "../components/common/Spinner";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setCourses([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const data = await searchCourses(query);
        if (!cancelled) {
          setCourses(data || []);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error.message || "Could not search courses");
        }
      }
      if (!cancelled) {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="border-b border-richblack-700 bg-richblack-800 py-6">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-50">
            Search
          </p>
          <h1 className="text-3xl font-semibold text-richblack-5">
            Results for{" "}
            <span className="text-yellow-50">&ldquo;{query}&rdquo;</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto w-11/12 max-w-maxContent py-10">
        {loading ? (
          <Spinner />
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <FiSearch className="text-5xl text-richblack-300" />
            <p className="text-xl font-semibold text-richblack-5">
              No courses found
            </p>
            <p className="max-w-md text-sm text-richblack-300">
              We couldn&rsquo;t find any course matching your search. Try
              different keywords or browse all courses.
            </p>
            <Link
              to="/catalog"
              className="rounded-md bg-yellow-50 px-5 py-2.5 font-semibold text-richblack-900 hover:bg-yellow-25"
            >
              Browse All Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
