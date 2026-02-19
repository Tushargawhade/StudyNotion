const RatinAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const RatingAndReview = require('../models/RatingAndReview');

// create RatingAndReview handler function

exports.createRating =async (req, res ) =>{

    try{

        // get userId  
        const userId = req.user.id;
        
        // fetch data from req.body 
        const {rating , review, courseId} = req.body;
        
        // check if user is enrolled or not 
        const courseDetails = await Course.findOne(
                                            {_id : courseId,
                                            studentEnrolled : {$elemMatch :{$eq: userId}},
                                        })

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message : "Student is not enrolled in the course"
            })
        }
        
        // check if user already reviewed the course
        const alreadyReviewed  = await RatingAndReview.findOne({
                                                        user : userId,      
                                                        course : courseId
                                                    })
        
        
        
        // create review and rating  
        const ratingReview = await RatingAndReview.create({
                                                    rating, review,
                                                    course : courseId,
                                                    user : userId,
                                               })


        
        // update course with this rating/review 
        const updatedCourseDetail = await Course.findByIdAndUpdate({_id:courseId},
                                            {
                                                $push : {
                                                    RatingAndReview : ratingReview._id,
                                                }
                                            },
                                            {new : true}
                                        )
        console.log(updatedCourseDetail);


        // return res 
        return res.status(200).json({
            success :true,
            message : "Rating and Review created successfully",
            ratingReview
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message
        })   
    }
}


