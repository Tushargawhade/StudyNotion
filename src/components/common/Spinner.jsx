import React from "react";

function Spinner() {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-richblack-200 border-t-yellow-50"></div>
    </div>
  );
}

export default Spinner;
