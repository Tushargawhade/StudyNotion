import React, { useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import ProfileDropDown from "../core/auth/ProfileDropDown";
import { fetchCourseCategories } from "../../services/operations/courseDetailsAPI";

const Navbar = () => {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  const [subLinks, setSubLinks] = useState([]);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCourseCategories();
        const links = data?.map((category) => ({
          title: category.name,
          path: `/catalog/${category.name}`,
        }));
        setSubLinks(links || []);
      } catch (error) {
        setSubLinks([]);
      }
    })();
  }, []);

  return (
    <div className="h-14 border-b-richblack-700 border-b-[1px] flex items-center justify-center">
      <div className="w-11/12 flex max-w-maxContent items-center justify-between">
        <Link to={"/"}>
          <img src={logo} alt="logo" width={160} height={42} loading="lazy" />
        </Link>

        <nav>
          <ul className="flex gap-x-6">
            {NavbarLinks.map((link, idx) => (
              <li key={idx}>
                {link.title === "Catalog" ? (
                  <div className="group relative flex items-center gap-1 text-richblack-25">
                    <p>{link.title}</p>
                    <IoIosArrowDropdownCircle />

                    <div className="invisible absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[50%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblue-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[57%] top-[-2px] h-6 w-6 rotate-45 rounded bg-richblack-5"></div>

                      {subLinks.length ? (
                        subLinks.map((subLink, idx) => (
                          <Link
                            to={subLink.path}
                            key={idx}
                            className={`rounded-lg bg-transparent px-4 py-1.5 transition-all duration-200 ${
                              matchRoute(subLink.path)
                                ? "bg-richblack-900 text-richblack-5"
                                : "hover:bg-richblack-900 hover:text-richblack-5"
                            }`}
                          >
                            {subLink.title}
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-richblack-500">
                          No categories found
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link.path)
                          ? "text-yellow-50"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-x-5">
          {token === null && (
            <Link to={"/login"}>
              <button className="border border-richblue-700 bg-richblack-800 px-[12px] py-[6px] rounded-lg text-richblack-25">
                Log in
              </button>
            </Link>
          )}

          {token === null && (
            <Link to={"/signup"}>
              <button className="border border-richblue-700 bg-richblack-800 px-[12px] py-[6px] rounded-lg text-richblack-25">
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
