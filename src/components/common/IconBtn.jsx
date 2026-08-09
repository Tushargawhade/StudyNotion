import React from "react";

function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      type={type}
      className={`flex cursor-pointer items-center gap-x-2 rounded-md py-2 px-5 font-semibold ${
        outline
          ? "border border-yellow-50 bg-transparent text-yellow-50 hover:bg-yellow-50 hover:text-white"
          : "bg-yellow-50 text-richblack-900"
      } ${customClasses || ""}`}
    >
      {children ? <>{children}</> : text}
    </button>
  );
}

export default IconBtn;
