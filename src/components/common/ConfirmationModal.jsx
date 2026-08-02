import React from "react";

function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">
          {modalData?.text1}
        </p>
        <p className="mt-3 mb-5 leading-6 text-richblack-200">
          {modalData?.text2}
        </p>
        <div className="flex items-center gap-x-4">
          <button
            onClick={modalData?.btn1Handler}
            className="cursor-pointer rounded-md bg-yellow-50 px-5 py-2 font-semibold text-richblack-900 hover:bg-yellow-25"
          >
            {modalData?.btn1Text}
          </button>
          <button
            onClick={modalData?.btn2Handler}
            className="cursor-pointer rounded-md bg-richblack-200 px-5 py-2 font-semibold text-richblack-900 hover:bg-richblack-100"
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
