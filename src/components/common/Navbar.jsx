import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  matchPath,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { FiChevronDown, FiSearch } from "react-icons/fi";
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
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setExploreOpen(false));
  useOnClickOutside(searchRef, () => setSearchQuery(""));

  useEffect(() => {
    fetchCourseCategories()
      .then((data) => setCategories(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setExploreOpen(false);
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
  };

  return (
    <div className="flex h-16 items-center justify-center border-b-[1px] border-richblack-700">
      <div className="grid w-11/12 max-w-maxContent grid-cols-[1fr_auto_1fr] items-center">
        <Link to="/" className="justify-self-start">
          <StudyVerseLogo variant="light" />
        </Link>

        <nav className="justify-self-center">
          <ul className="flex items-center gap-x-6">
            {NavbarLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link?.path}>
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
                    className="block px-4 py-2.5 text-sm font-medium text-richblack-25 hover:bg-richblack-900 hover:text-yellow-50"
                  >
                    All Courses
                  </Link>
                  <div className="border-t border-richblack-700" />
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/catalog/${category._id}`}
                      className="block px-4 py-2.5 text-sm font-medium text-richblack-25 hover:bg-richblack-900 hover:text-yellow-50"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>

        <div className="flex items-center justify-self-end gap-x-4">
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
            <Link to="/login">
              <button className="rounded-lg border border-richblack-500 px-[18px] py-[8px] text-sm font-medium text-richblack-25 transition-all duration-200 hover:border-yellow-50 hover:text-yellow-50">
                Log in
              </button>
            </Link>
          )}

          {token === null && (
            <Link to="/signup">
              <button className="rounded-lg bg-yellow-50 px-[18px] py-[8px] text-sm font-medium text-richblack-900 transition-all duration-200 hover:bg-yellow-25">
                Sign up
              </button>
            </Link>
          )}

          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
