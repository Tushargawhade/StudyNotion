import React, { useState } from 'react'
import {HomePageExplore} from '../../../data/homepage_explore'
import HighlightedText from './HighlightedText';
import CourseCard from './CourseCard';


const tabsName =[
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"

]



const ExploreMore = () => {

    const [currentTab, setCurrentTab]  = useState(tabsName[0]);
    const [course, setCourse] =  useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)


    const setMyCards = (value)=>{
        setCurrentTab(value);
        const result = HomePageExplore.filter((course)=> course.tag === value);
        setCourse(result[0].courses)
        setCurrentCard(result[0].courses[0].heading)

    }



  return (
    <div>

        <div className='text-4xl font-semibold text-center'>
            Unlock the 
            <HighlightedText text={"Power of code"} />
        </div>

        <p className='text-center text-richblack-300 text-md mt-2 '>
            Learn to build anything you can imagine 
        </p>

        <div className='mt-5 mb-12 px-1 py-1 flex rounded-full bg-richblack-800 border-richblack-400 '>
        {
            tabsName.map((elem,idx)=>{
                return (
                    <div 
                    className={`text-[16px] flex items-center gap-2 rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900  hover:text-richblack-5 px-6 py-2 ${currentTab === elem ? "bg-richblack-900 text-richblack-5 font-medium"  : "text-richblue-50"}`}
                    key={idx}
                    onClick={()=> setMyCards(elem)}
                    >
                        {elem}
    
                    </div>
                )
            })
        }
        </div>

        <div className='lg:h-[150px]'> </div>

        {/* courses kee card */}

        <div className="lg:absolute mt-4 gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">

            {
                course.map((elem,idx)=>{
                    return (
                        <CourseCard 
                            key={idx}
                            cardData={elem}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                        />    

                    )
                })
            }



        </div>


    </div>
  )
}

export default ExploreMore
