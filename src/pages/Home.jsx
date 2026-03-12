import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import HighlightedText from '../components/core/homepage/HighlightedText';
import CTAButton from '../components/core/homepage/Button';
import Banner from '../assets/Images/banner.mp4'



const Home = () => {
  return (
    <div>

        {/* section 1 */}
        <div className='relative mx-auto max-w-maxContent flex flex-col w-11/12 items-center text-white  '>

            <Link to={"/signup"}>

                <div className='group mx-auto bg-richblack-800 p-1 mt-16 rounded-full font-semibold transition-all duration-200 hover:scale-90 w-fit '>
                    <div className='flex items-center gap-2  px-5 py-[5px] rounded-full transition-all duration-200 group-hover:bg-richblack-900 '>
                        <p>Become an Instructor</p>
                        <FaArrowRight />
                    </div>
                </div>


            </Link>
             
            <div className='mt-6 text-4xl font-semibold'>
                Empower Your Future with 
                <HighlightedText  text={"Coding Skills"}/>

            </div>

            <div className='w-[90%] text-center mt-4 text-md text-richblack-400 font-bold'>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>

            <div className='flex flex-row gap-10 mt-5'>

                <CTAButton active={true} linkto="/signup">
                    learn more 
                </CTAButton>

                <CTAButton active={false} linkto="/login">
                    Book a Demo
                </CTAButton>

                 
            </div>

            <div className='mx-3 my-12 shadow-blue-200'>

                <video muted loop autoPlay>
                    <source src={Banner} type="video/mp4" />

                </video>



            </div>



        </div>






        {/* section 2 */}






        {/* section 3 */}






        {/* footer */}

      



    </div>
  )
}

export default Home
