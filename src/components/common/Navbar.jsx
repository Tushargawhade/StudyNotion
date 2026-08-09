import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  matchPath,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { FiChevronDown, FiMenu, FiSearch, FiX } from "react-icons/fi";
import { NavbarLinks } from "../../data/navbar-links";
import ProfileDropDown from "../core/auth/ProfileDropDown";
import StudyVerseLogo from "./StudyVerseLogo";
import { fetchCourseCategories } from "../../services/operations/courseDetailsAPI";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [exploreOpen, setExploreOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const rootRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setExploreOpen(false));
  useOnClickOutside(searchRef, () => setSearchQuery(""));
  useOnClickOutside(rootRef, () => setMobileMenuOpen(false));

  useEffect(() => {
    fetchCourseCategories()
      .then((data) => setCategories(data || []))
      .catch(() => {});
  }, []);

  const popularCategories = categories
    .filter((category) => (category.courseCount ?? 0) > 0)
    .slice(0, 3);

  useEffect(() => {
    setExploreOpen(false);
    setMobileMenuOpen(false);
    setMobileExploreOpen(false);
  }, [location.pathname]);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      return;
    }
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchQuery("");
    setMobileMenuOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className="relative flex h-16 items-center justify-center border-b-[1px] border-richblack-700"
    >
      <div className="grid w-11/12 max-w-maxContent grid-cols-[1fr_auto_1fr] items-center">
        <Link to="/" className="col-start-1 justify-self-start">
          <StudyVerseLogo variant="light" />
        </Link>

        <nav className="col-start-2 hidden justify-self-center md:block">
          <ul className="flex items-center gap-x-6">
            {NavbarLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link?.path}
                  onClick={(e) => {
                    if (matchRoute(link.path)) e.preventDefault();
                  }}
                >
                  <p
                    className={`text-md font-medium transition-colors duration-200 ${
                      matchRoute(link.path)
                        ? "text-yellow-50"
                        : "text-richblack-25 hover:text-yellow-50"
                    }`}
                  >
                    {link.title}
                  </p>
                </Link>
              </li>
            ))}

            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setExploreOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-md font-medium transition-colors duration-200 ${
                  matchRoute("/catalog")
                    ? "text-yellow-50"
                    : "text-richblack-25 hover:text-yellow-50"
                }`}
              >
                Explore
                <FiChevronDown
                  className={`transition-transform duration-200 ${
                    exploreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {exploreOpen && (
                <div className="absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 overflow-hidden rounded-md border border-richblack-700 bg-richblack-800 shadow-lg shadow-black/30">
                  <Link
                    to="/catalog"
                    onClick={(e) => {
                      if (matchRoute("/catalog")) e.preventDefault();
                    }}
                    className="block px-4 py-2.5 text-sm font-medium text-richblack-25 hover:bg-richblack-900 hover:text-yellow-50"
                  >
                    All Courses
                  </Link>
                  {popularCategories.length > 0 && (
                    <>
                      <div className="border-t border-richblack-700" />
                      {popularCategories.map((category) => (
                        <Link
                          key={category._id}
                          to={`/catalog/${category._id}`}
                          onClick={(e) => {
                            if (matchRoute(`/catalog/${category._id}`))
                              e.preventDefault();
                          }}
                          className="block px-4 py-2.5 text-sm font-medium text-richblack-25 hover:bg-richblack-900 hover:text-yellow-50"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}
            </li>
          </ul>
        </nav>

        <div className="col-start-3 flex items-center justify-self-end gap-x-4">
          {token !== null && (
            <form
              onSubmit={handleSearch}
              ref={searchRef}
              className="hidden items-center gap-2 rounded-md border border-richblack-600 bg-richblack-800 px-3 py-1.5 focus-within:border-yellow-50 md:flex"
            >
              <FiSearch className="text-richblack-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-40 bg-transparent text-sm text-richblack-5 placeholder:text-richblack-300 focus:outline-none"
              />
            </form>
          )}

          {token === null && (
            <div className="hidden items-center gap-x-4 md:flex">
              <Link to="/login">
                <button className="rounded-lg bg-yellow-50 px-[18px] py-[8px] text-sm font-medium text-richblack-900 transition-all duration-200 hover:bg-yellow-25">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-lg bg-yellow-50 px-[18px] py-[8px] text-sm font-medium text-richblack-900 transition-all duration-200 hover:bg-yellow-25">
                  Sign up
                </button>
              </Link>
            </div>
          )}

          {token !== null && <ProfileDropDown />}

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-md p-1.5 text-richblack-25 transition-colors duration-200 hover:text-yellow-50 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <FiX className="text-2xl" />
            ) : (
              <FiMenu className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute left-0 top-full z-50 max-h-[calc(100vh-4rem)] w-full overflow-y-auto border-b border-richblack-700 bg-richblack-900 px-4 py-2 shadow-lg shadow-black/30 md:hidden">
          <nav>
            {NavbarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  if (matchRoute(link.path)) {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                  }
                }}
              >
                <p
                  className={`border-b border-richblack-700 py-3 text-sm font-medium ${
                    matchRoute(link.path)
                      ? "text-yellow-50"
                      : "text-richblack-25 hover:text-yellow-50"
                  }`}
                >
                  {link.title}
                </p>
              </Link>
            ))}
          </nav>

          <div className="border-b border-richblack-700">
            <button
              onClick={() => setMobileExploreOpen((prev) => !prev)}
              className="flex w-full items-center justify-between py-3 text-sm font-medium text-richblack-25 hover:text-yellow-50"
            >
              Explore
              <FiChevronDown
                className={`text-base transition-transform duration-200 ${
                  mobileExploreOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileExploreOpen && (
              <div className="pb-2">
                <Link
                  to="/catalog"
                  onClick={(e) => {
                    if (matchRoute("/catalog")) e.preventDefault();
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 pl-4 text-sm text-richblack-100 hover:text-yellow-50"
                >
                  All Courses
                </Link>
                {popularCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/catalog/${category._id}`}
                    onClick={(e) => {
                      if (matchRoute(`/catalog/${category._id}`))
                        e.preventDefault();
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 pl-4 text-sm text-richblack-100 hover:text-yellow-50"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {token === null && (
            <div className="mt-3 flex flex-col gap-2 pb-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full rounded-md border border-richblack-500 px-4 py-2 text-sm font-medium text-richblack-25 hover:border-yellow-50 hover:text-yellow-50">
                  Log in
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full rounded-md bg-yellow-50 px-4 py-2 text-sm font-medium text-richblack-900 hover:bg-yellow-25">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
