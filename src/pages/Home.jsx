import React, { useEffect, useState } from 'react'
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import HighlightedText from '../components/core/homepage/HighlightedText';
import CTAButton from '../components/core/homepage/Button';
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/homepage/CodeBlocks';
import TimeLineSection from '../components/core/homepage/TimeLineSection';
import LearningLanguageSection from '../components/core/homepage/LearningLanguageSection';
import InstructorSection from '../components/core/homepage/InstructorSection';
import ExploreMore from '../components/core/homepage/ExploreMore'
import ReviewSlider from '../components/common/ReviewSlider';
import CourseCard from '../components/core/course/CourseCard';
import { fetchAllCourses } from '../services/operations/courseDetailsAPI';

const Home = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAllCourses();
        setCourses(data || []);
      } catch (error) {
        setCourses([]);
      }
    })();
  }, []);

  const latestCourses = courses.slice(0, 8);
  const totalStudents = courses.reduce(
    (acc, course) => acc + (course.studentsEnrolled?.length || 0),
    0
  );

  return (
    <div>

        {/* section 1 */}
        <div className='relative mx-auto max-w-maxContent flex flex-col w-11/12 items-center text-richblack-25  '>

            {/* starting part  */}

            <Link to={"/signup"}>

                <div className='group mx-auto bg-richblack-800 p-1 mt-16 rounded-full font-semibold transition-all duration-200 hover:scale-105 w-fit '>
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
                    Start Learning Free
                </CTAButton>

                <CTAButton active={false} linkto="/catalog">
                    Explore Courses
                </CTAButton>

                 
            </div>

            <div className='mx-3 my-10 w-full max-w-[800px] rounded-2xl border border-richblack-700 bg-richblack-800 p-2 shadow-lg shadow-[#DBEAFE]'>

                <video muted loop autoPlay className="w-full rounded-xl">
                    <source src={Banner} type="video/mp4" />
                </video>



            </div>


            {/* first coding part  */}

            <div className='flex flex-col gap-3'>

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
            

            <ExploreMore courses={courses} />
 




        </div>

        {/* section 2 */}

        <div className=' bg-blue-5 text-richblack-25 '>

            {/* <div className='homepage_bg h-[310px]'>

                   <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-5 mx-auto'>
                        <div className='h-[180px]'>

                        </div>

                        <div className='flex  mt-6 gap-8 text-richblack-25'>

                            <CTAButton active={true} linkto={"/catalog"}  >
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

            </div> */}

            <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-7 mx-auto mb-10 mt-5'>
                
                <div className='flex flex-col gap-10 lg:flex-row lg:gap-16 mt-10'>

                    <div className='text-4xl font-semibold w-full lg:w-[45%]'>
                        Get the skills you need for a
                        <HighlightedText text={"job that is in demand"}/>
                    </div>

                    <div className='flex flex-col gap-10 w-full lg:w-[40%] items-start'>
                        <p className='font-semibold text-richblack-600'>StudyVerse lets you learn on your own terms. Today, to be a competitive specialist requires more than professional skills.</p>

                        <CTAButton active={true} linkto={"/signup"}>
                            Learn More
                        </CTAButton>

                    </div>

                </div>

                <TimeLineSection
                  coursesCount={courses.length}
                  studentsCount={totalStudents}
                />

                <LearningLanguageSection/>


            </div>

         



        </div>



        {/* section 3 */}

        <div className='w-11/12 mx-auto  max-w-maxContent flex flex-col justify-center gap-8 bg-richblack-900 text-richblack-25 items-center '>
            
            <InstructorSection/>

            {latestCourses.length > 0 && (
              <div className="flex w-full flex-col items-center gap-8 m-4">
                <h2 className='text-center text-4xl font-semibold '>
                  Latest <span className='text-yellow-50'>Courses</span>
                </h2>
                <div className='grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {latestCourses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>

                <Link
                  to="/catalog"
                  className="flex items-center gap-2 mt-6 rounded-md border border-yellow-50 px-5 py-2.5 font-semibold text-yellow-50 transition-all hover:bg-yellow-50 hover:text-richblack-900"
                >
                  View Full Catalog <FaArrowRight />
                </Link>
              </div>
            )}

            <div className="flex w-full flex-col items-center gap-3 pb-12">
              <h2 className='text-center text-4xl font-semibold '>
                Reviews from our <span className='text-yellow-50'>Learners</span>
              </h2>
              <p className='max-w-xl text-center text-sm leading-6 text-richblack-200'>
                Hear what our students have to say about the courses they love.
              </p>
            </div>

        </div>

        {/* section 3 reviews (full width) */}

        <div className='bg-richblack-900 pb-20'>

            <ReviewSlider />

        </div>

    </div>
  )
}

export default Home
