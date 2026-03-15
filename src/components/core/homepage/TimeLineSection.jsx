import React from 'react'

import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import { FaHeading } from 'react-icons/fa6'
import TimeLineImage from "../../../assets/Images/TimelineImage.png"


const timeline =[
    {
        Logo : Logo1,
        heading : "Leadership",
        Description : "Fully commited to the success company"
    },
    {
        Logo : Logo2,
        heading : "Leadership",
        Description : "Fully commited to the success company"
    },
    {
        Logo : Logo3,
        heading : "Leadership",
        Description : "Fully commited to the success company"
    },
    {
        Logo : Logo4,
        heading : "Leadership",
        Description : "Fully commited to the success company"
    }
]


const TimeLineSection = () => {
  return (
    <div>

        <div className='flex gap-15 items-center'>

            <div className='w-[40%] flex flex-col gap-5'>

                {
                    timeline.map((elem, idx)=>{
                        return ( 

                            <div className='flex gap-2' key={idx}>

                                <div className='w-[60px] h-[60px] rounded-full bg-white flex '>
                                    <img src={elem.Logo} alt="" />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h1 className='font-semibold text-[18px]'>{elem.heading}</h1>
                                    <p className='text-base'> {elem.Description}</p>
                                </div>

                            </div>
                        )
                    })
                }


            </div>


            <div className='relative shadow-blue-200'>

                <img src={TimeLineImage} alt="timelineimg" className='shadow-white object-cover h-fit'/>

                <div className='absolute bg-caribbeangreen-700 flex trext-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%] '>
                    <div className='flex text-white gap-8 items-center border-r border-caribbeangreen-50 px-16'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-caribbeangreen-300 text-sm  '>Year of Experience </p>
                    </div>

                    <div className='flex text-white gap-8 items-center px-16'>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-caribbeangreen-300 text-sm '>Types of Course </p>


                    </div>

                </div>




            </div>



               



        </div>












      
    </div>
  )
}

export default TimeLineSection
