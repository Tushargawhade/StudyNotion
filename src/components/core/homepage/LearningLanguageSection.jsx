import React from 'react'
import HighlightedText from './HighlightedText'
import Know_your_progress from '../../../assets/Images/Know_your_progress.png'
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from '../../../assets/Images/Plan_your_lessons.png'


const LearningLanguageSection = () => {
  return (
    <div className='mt-[120px]'>

        <div className='flex flex-col gap-5'>

            <div className='text-4xl font-semibold text-center'>
                Your Swiss Knife for
                <HighlightedText text={"learning any language"} />
            </div>

            <div className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]'>
                Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more
            </div>

            <div className='flex items-center justify-center mt-5'>
                <img src={Know_your_progress} 
                     alt="Know_your_progress_img"
                     className='object-contain -mr-32' 
                />

                <img src={compare_with_others} 
                     alt="compare_with_others_img"
                     className='object-contain ' 
                />

                <img src={plan_your_lesson} 
                     alt="plan_your_lesson_img"
                     className='object-contain -ml-32' 
                />

            </div>



        </div>
      
    </div>
  )
}

export default LearningLanguageSection
