const { response } = require('express');
const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

const {uploadImageToCloudinary} = require('../utils/imageUploader')

// Create course handler function  

exports.createCourse = async (req,res)=>{

    try{

        // fetch data 
        const {courseName, courseDescription, whatWillYouLearn, price, category } = req.body;

        // fetch thumbnail
        const thumbnail = req.files.thumbnaliImage;

        // validation 
        if(!courseName || !courseDescription || !whatWillYouLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success : false,
                message : "All fields are requires for course creation "
            })
        }

        // Changes Required in userId  and InstructorDetails   


        // check for instructor 
        
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor ID : ",instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success : false,
                message : "Instructor detail not found"
            })
        };


        // check given tag is valid or not  
        const categoryDetails  = await Category.findById(tag);
        if(!categoryDetails){
            return res.status(404).json({
                success : false,
                message : "Category detail not found"
            })
        };




        // upload image to cloudinary 
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);


        // create an entry for new course 
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            whatWillYouLearn : whatWillYouLearn,
            price,
            category : categoryDetails._id,
            thumbnail :thumbnailImage.secure_url
        })


        // add the new course to the user schema of instructor 

        await User.findByIdAndUpdate(
                    {_id : instructorDetails._id},
                    {
                        $push :{
                            course :newCourse._id,
                        }
                    },
                    {new : true}
                )


        // update the tag schema 




        // return response  
        return res.status(200).json({
            success : true,
            message : "Course Created Successfully",
            data : newCourse,
        })


    }
    catch(error){
        return res.status(500).json({
            success: false,
            errormessage : "Error in creating Course",
            message :error.message,
            
        })
    }



}



// Get All course handler function  
exports.showAllCourses = async (req,res)=>{

    try{

        const allCourses = await Course.find({},
                                                {courseName : true,
                                                 price : true,
                                                 thumbnail :true,
                                                 instructor : true,
                                                 ratingAndreview :true,
                                                 studentEnrolled : true},)
                                                .populate("Instructor")
                                                .exec();

        return res.status(200).json({
            success: true,
            message : "Data for all courses fetched successfully",
            allCourses, 
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message : "Cannot fetch the all courses!!"
        })
    }



}


// Show all detail of a single course handler function
exports.getCourseDetails = async (req, res)=>{
    try{

        // get id 
        const {courseId} = req.body;

        // find course details 
        const courseDetails = await Course.find(
                                       {_id : courseId})
                                        .populate(
                                            {
                                                path : "instructor",
                                                populate : {
                                                    path : "additionalDetails",
                                                }
                                            }
                                        )
                                        .populate("category")
                                        .populate("ratingAndreview")
                                        .populate({
                                            path : "courseContent",
                                            populate : {
                                                path : "subSection"
                                            },
                                        })
                                        .exec()
        
        // validation 
        if(!courseDetails){
            return res.status(400).json({
                success : false,
                message : "Course details not found for the given course ID"
            })
        }


        // return res 

        return res.status(200).json({
            success : true,
            message : "Course details fetched successfully",
            courseDetails,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Error in fetching course details",
            errorMessage : error.message,
        })
    }
} 
