import React from 'react'
import CTAButton from "../homepage/Button"
import { FaArrowRight } from "react-icons/fa6";

import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({
    position, heading, subheading,  ctabtn1, ctabtn2, codeblock, codecolor
}) => {
  return (
    <div className={`flex flex-col ${position === "flex-row-reverse" ? "lg:flex-row-reverse" : "lg:flex-row"} my-20 justify-between gap-10`}>

        {/* section 1  */}
        <div className='w-full lg:w-[50%] flex flex-col gap-6'>
            {heading}
            <div className='text-richblack-500 font-semibold'>
                {subheading}
            </div>

            <div className='flex flex-wrap gap-6 mt-2'>
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight />
                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                    {ctabtn2.btnText}
                </CTAButton>

            </div>


        </div>

        {/* section 2  */}
        <div className='h-fit flex w-full text-[14px] lg:w-[500px]'>
            {/* bg gradient  */}

            <div className='text-center w-[10%] flex flex-col text-richblack-400 font-inter font-semibold'> 
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>

            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codecolor} pr-2  `}>

                <TypeAnimation
                    sequence={[codeblock, 1000, ""]}
                    cursor={true}
                    repeat={Infinity}

                    style={{
                        whiteSpace: "pre-line",
                        display: "block",
                        }}
                    omitDeletionAnimation={true}
          />

            </div>




        </div>
      
    </div>
  )
}

export default CodeBlocks
