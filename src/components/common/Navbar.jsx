import React, { useEffect } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { IoCartOutline } from "react-icons/io5";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import ProfileDropDown from '../core/auth/ProfileDropDown';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';




const Navbar = () => {
    const location = useLocation();

    const {token} = useSelector((state)=>state.auth);
    const {user} = useSelector((state)=>state.profile);
    const {totalItems} = useSelector((state)=>state.cart);      
 
    const mathchRoute = (route)=>{
        return matchPath({path: route}, location.pathname)
    }

    const subLinks = [
        {
            title : "Python",
            path : "/catalog/Python"
        },
        {
            title : "Web-Dev",
            path : "/catalog/Web-Dev"
        }
    
    ]


    useEffect( ()=>{


    }, [])

  return (
    <div className='h-14 border-b-richblack-700 border-b-[1px] flex items-center justify-center '>

        <div className='w-11/12 flex max-w-maxContent items-center justify-between '>


        {/* logo  */}

            <Link to={"/"}>
                <img src={logo} alt="logo" width={160} height={42} loading='lazy' />
            </Link>

        {/* links  */}  
        
            <nav>

                <ul className='flex gap-x-6 '>
                    {
                        NavbarLinks.map((link, idx)=>(
                            <li key={idx}>
                                {
                                    link.title === "Catalog" ? (
                                    
                                    <div className='relative flex items-center gap-1 text-richblack-25 group '>

                                        <p >{link.title}</p> 
                                        <IoIosArrowDropdownCircle />

                                        <div className='invisible absolute left-[50%] translate-x-[-50%] translate-y-[50%] top-[50%] flex flex-col rounded-md bg-richblack-25 text-richblue-900 p-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]'>


                                        <div className='absolute left-[57%] top-[-2px]  h-6 w-6  rotate-45 rounded bg-richblack-25 '>
                                        </div>

                                        {
                                            subLinks.length ? (

                                                subLinks.map((subLink, idx) =>(

                                                    <Link to={`${subLink.path}`} key={idx}>
                                                        <p>{subLink.title}</p>


                                                    
                                                    </Link>


                                                ))


                                            ) : (<div></div>)
                                        }

                                        </div>

                        

                               

                                    </div>
                                    
                                    ) : (
                                        <Link to={link?.path}>
                                            <p className={`${mathchRoute(link.path) ? "text-yellow-50" : "text-richblack-25"}`}>
                                                {link.title}
                                            </p>
                                        </Link>
                                    )
                                }
                            </li>

                        ))
                    }

                </ul>


            </nav>

        {/* login/signUp/dashboard  */}
            
            <div className='flex gap-x-5 items-center'>

                {
                    user && user?.accountType != "Instructor" && (
                        <Link to={"/dashboard/cart"} className='relative'>
                            <IoCartOutline />
                            {
                                totalItems > 0 && (
                                    <span>
                                        {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }

                {
                    token === null &&(
                        <Link to={"/login"}>
                            <button className='border border-richblue-700 bg-richblack-800 text-richblack-25 px-[12px] py-[6px] rounded-lg'>
                                Log in 
                            </button>
                        </Link>
                    )
                }

                {
                    token === null && (
                        <Link to={"/signup"}>
                            <button className='border border-richblue-700 bg-richblack-800 text-richblack-25 px-[12px] py-[6px] rounded-lg'>
                                Sign up
                            </button>
                        </Link>
                    )
                }

                {
                    token !== null && <ProfileDropDown/>
                }







            </div>


        </div>
       
    </div>
  )
}

export default Navbar
