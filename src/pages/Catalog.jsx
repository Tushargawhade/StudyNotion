import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiBookOpen } from "react-icons/fi";
import { fetchAllCourses } from "../services/operations/courseDetailsAPI";
import { getWishlist } from "../services/operations/wishlistAPI";
import CourseCard from "../components/core/course/CourseCard";
import Spinner from "../components/common/Spinner";

function Catalog() {
  const { categoryId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAllCourses();
        setCourses(data || []);
      } catch (error) {
        toast.error(error.message || "Could not load courses");
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (token && user?.accountType === "Student") {
      getWishlist(token, dispatch).catch(() => {});
    }
  }, [token, user, dispatch]);

  const groupedCourses = useMemo(() => {
    const groups = {};
    courses.forEach((course) => {
      const name = course.category?.name || "Uncategorized";
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push(course);
    });
    return Object.entries(groups)
      .map(([name, list]) => ({ name, list }))
      .sort((a, b) => b.list.length - a.list.length);
  }, [courses]);

  const selectedCategory = useMemo(() => {
    if (!categoryId) {
      return null;
    }
    return courses.find((course) => course.category?._id === categoryId)
      ?.category || null;
  }, [categoryId, courses]);

  const categoryCourses = useMemo(() => {
    if (!categoryId) {
      return [];
    }
    return courses.filter((course) => course.category?._id === categoryId);
  }, [categoryId, courses]);

  if (loading) {
    return <Spinner />;
  }

  if (courses.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <FiBookOpen className="text-5xl text-richblack-300" />
        <p className="text-2xl font-semibold text-richblack-5">
          No courses available yet
        </p>
        <p className="max-w-md text-sm text-richblack-300">
          Courses will appear here as soon as instructors publish them. Stay
          tuned!
        </p>
        <Link
          to="/"
          className="rounded-md bg-yellow-50 px-5 py-2.5 font-semibold text-richblack-900 hover:bg-yellow-25"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  if (categoryId && categoryCourses.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <FiBookOpen className="text-5xl text-richblack-300" />
        <p className="text-2xl font-semibold text-richblack-5">
          No courses in this category yet
        </p>
        <p className="max-w-md text-sm text-richblack-300">
          Check back later or explore other categories.
        </p>
        <Link
          to="/catalog"
          className="rounded-md bg-yellow-50 px-5 py-2.5 font-semibold text-richblack-900 hover:bg-yellow-25"
        >
          Browse All Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="text-richblack-25">
      <div className="border-b border-richblack-700 bg-richblack-800 py-6">

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-50">
            Catalog
          </p>
          <h1 className="text-3xl font-semibold">
            {selectedCategory ? (
              <>
                {selectedCategory.name}
              </>
            ) : (
              <>
                Explore our <span className="text-yellow-50">Courses</span>
              </>
            )}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-richblack-200">
            {selectedCategory
              ? selectedCategory.description ||
                `Browse all the ${selectedCategory.name} courses published on StudyVerse.`
              : "Browse all the courses published on StudyVerse, grouped by category. Pick a category below and start learning at your own pace."}
          </p>
          <p className="text-sm font-medium text-richblack-300">
            {categoryId
              ? `${categoryCourses.length} course${
                  categoryCourses.length === 1 ? "" : "s"
                } in ${selectedCategory?.name || "this category"}`
              : `${courses.length} courses across ${groupedCourses.length} categories`}
          </p>
        </div>

      </div>

      <div className="mx-auto w-11/12 max-w-maxContent py-10">
        {categoryId ? (
          <section className="mb-12">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-yellow-50"></span>
              <h2 className="text-2xl font-semibold">
                {selectedCategory?.name || "Category"}
              </h2>
              <span className="rounded-full bg-richblack-700 px-2.5 py-0.5 text-xs font-medium text-richblack-200">
                {categoryCourses.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="mb-12">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-8 w-1 rounded-full bg-yellow-50"></span>
                <h2 className="text-2xl font-semibold">All Courses</h2>
                <span className="rounded-full bg-richblack-700 px-2.5 py-0.5 text-xs font-medium text-richblack-200">
                  {courses.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            </section>

            {groupedCourses.map((group) => (
              <section key={group.name} className="mb-12">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-8 w-1 rounded-full bg-yellow-50"></span>
                  <h2 className="text-2xl font-semibold">{group.name}</h2>
                  <span className="rounded-full bg-richblack-700 px-2.5 py-0.5 text-xs font-medium text-richblack-200">
                    {group.list.length}
                  </span>
                </div>

                <div className="catalog-scroll flex gap-6 overflow-x-auto pb-4">
                  {group.list.map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      className="w-[290px] shrink-0"
                    />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Catalog;
