import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightedText from './HighlightedText'
import CTAButton from './Button'
import { FaArrowRight } from "react-icons/fa6";

const InstructorSection = () => {
  return (
    <div className='mt-2'>

        <div className='flex flex-col gap-10 items-center lg:flex-row lg:gap-20'>

            <div className='w-full lg:w-[50%] '>
                <img src={Instructor} alt="Instructor" className='w-full shadow-[#DBEAFE]' />
            </div>

            <div className='w-full lg:w-[50%] flex flex-col gap-10 items-center lg:items-start text-center lg:text-left'>
                
                <div className='text-3xl lg:text-4xl font-semibold w-full lg:w-[50%]'>
                    Become an 
                    <HighlightedText text={"Instructor"} />
                </div>

                <p className='text-richblack-300 text-[16px] font-medium w-full lg:w-[80%]'>
                    Instructors from around the world teach millions of students on StudyVerse. We provide the tools and skills to teach what you love.
                </p>

                <div className='w-fit'>

                    <CTAButton active={true} linkto={"/signup"}>
                        <div className='flex gap-2 items-center justify-center  '>
                            Become an Instructor
                            <FaArrowRight  />
                        </div>
                    </CTAButton>

                </div>
                

            </div>


        </div>
      
    </div>
  )
}

export default InstructorSection
