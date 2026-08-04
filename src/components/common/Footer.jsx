import React from "react";
import { Link } from "react-router-dom";
import StudyVerseLogo from "./StudyVerseLogo";

import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const Company = [
  { title: "About", link: "/about" },
  { title: "Careers" },
  { title: "Affiliates" },
];

const Resources = [{ title: "Blog" }, { title: "Docs" }, { title: "Projects" }];

const Support = [
  { title: "Help Center" },
  { title: "Contact", link: "/contact" },
];

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];

const FooterLink = ({ title, link }) => {
  if (link) {
    return (
      <Link
        to={link}
        className="text-[14px] text-richblack-400 transition-all duration-200 hover:text-yellow-50"
      >
        {title}
      </Link>
    );
  }
  return <span className="text-[14px] text-richblack-400">{title}</span>;
};

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className="mx-auto w-11/12 max-w-maxContent py-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xs space-y-3">
            <StudyVerseLogo variant="light" />
            <p className="text-sm leading-6 text-richblack-400">
              Learn on your own terms with expert-led courses.
            </p>
            <div className="flex gap-3 text-lg text-richblack-400">
              <FaFacebook />
              <FaGoogle />
              <FaTwitter />
              <FaYoutube />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10">
            <div className="flex flex-col gap-2">
              <h1 className="mb-1 text-sm font-semibold text-richblack-50">
                Company
              </h1>
              {Company.map((item, i) => (
                <FooterLink key={i} {...item} />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="mb-1 text-sm font-semibold text-richblack-50">
                Resources
              </h1>
              {Resources.map((item, i) => (
                <FooterLink key={i} {...item} />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="mb-1 text-sm font-semibold text-richblack-50">
                Support
              </h1>
              {Support.map((item, i) => (
                <FooterLink key={i} {...item} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-richblack-700 pt-5 text-sm text-richblack-400 sm:flex-row">
          <div>© 2026 StudyVerse. All rights reserved.</div>
          <div className="flex">
            {BottomFooter.map((item, i) => (
              <span
                key={i}
                className={`${
                  BottomFooter.length - 1 === i
                    ? "px-3"
                    : "border-r border-richblack-700 px-3"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
