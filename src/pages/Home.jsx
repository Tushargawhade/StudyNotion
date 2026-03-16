import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import HighlightedText from '../components/core/homepage/HighlightedText';
import CTAButton from '../components/core/homepage/Button';
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/homepage/CodeBlocks';
import TimeLineSection from '../components/core/homepage/TimeLineSection';
import LearningLanguageSection from '../components/core/homepage/LearningLanguageSection';
import InstructorSection from '../components/core/homepage/InstructorSection';


const Home = () => {
  return (
    <div>

        {/* section 1 */}
        <div className='relative mx-auto max-w-maxContent flex flex-col w-11/12 items-center text-white  '>

            {/* starting part  */}

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


            {/* first coding part  */}

            <div className='flex flex-col gap-4'>

                <CodeBlocks
                    position={"flex-row"} 
                    heading={ 
                        <div className='text-4xl font-semibold'>
                            Unlock your 
                            <HighlightedText text={"coding potential "} />
                            with your online courses.
                        </div>
                    }
                    subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}

                    ctabtn1={
                        {
                            btnText: "try it yourself ",
                            linkto: "/signup",
                            active : true
                        }
                    }

                    ctabtn2={
                        {
                            btnText: "learn more",
                            linkto: "/login",
                            active : false
                        }
                    }
                    
                    codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                    
                    codecolor={"text-yellow-25"}
                />


                 <CodeBlocks
                    position={"flex-row-reverse"} 
                    heading={ 
                        <div className='text-4xl font-semibold'>
                            Start
                            <HighlightedText text={"coding in seconds "} />
                        </div>
                    }
                    subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}

                    ctabtn1={
                        {
                            btnText: "Continue Lesson",
                            linkto: "/signup",
                            active : true
                        }
                    }

                    ctabtn2={
                        {
                            btnText: "Learn More",
                            linkto: "/login",
                            active : false
                        }
                    }
                    
                    codeblock={`<!DOCTYPE html>\n <html lang="en">\nhead><title>Example</title><linkrel="stylesheet"href="styles.css"> \n/head> \nbody> \nh1><ahref="/">Header</a> \n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
                    
                    codecolor={"text-blue-25"}
                />

            </div>

        </div>

        {/* section 2 */}

        <div className=' bg-pure-greys-5 text-richblack-700 '>

            <div className='homepage_bg h-[310px]'>

                   <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-5 mx-auto'>
                        <div className='h-[95px]'>

                        </div>

                        <div className='flex  gap-8 text-white'>

                            <CTAButton active={true} linkto={"/signup"}  >
                                <div className='flex gap-3 items-center'>
                                    Explore Full Catalog
                                    <FaArrowRight/>
                                </div>
                            </CTAButton>

                            <CTAButton active={false} linkto={"/login"}>
                                Learn More
                            </CTAButton>

                        </div>

                   </div>

            </div>

            <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-7 mx-auto mb-10 mt-10'>
                
                <div className='flex gap-16'>

                    <div className='text-4xl font-semibold w-[45%]'>
                        Get the skills you need for a
                        <HighlightedText text={"job that is in demand"}/>
                    </div>

                    <div className='flex flex-col gap-10 w-[40%] items-start'>
                        <p className='font-semibold text-richblack-600'>The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.</p>

                        <CTAButton active={true} linkto={"/signup"}>
                            Learn More
                        </CTAButton>

                    </div>

                </div>

                <TimeLineSection/>

                <LearningLanguageSection/>


            </div>

         



        </div>



        {/* section 3 */}

        <div className='w-11/12 mx-auto max-w-maxContent flex flex-col justify-center gap-8 bg-richblack-900 text-white items-center '>
            
            <InstructorSection/>

            <h2 className='text-center text-4xl font-semibold '>Review from others learner</h2>





        </div>






        {/* footer */}

        
    
      



    </div>
  )
}

export default Home
