const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/courseEnrollmentEmail');
const { default: mongoose } = require('mongoose');
const e = require('express');

// Capture the payment and initiate the Razorpay order 
exports.capturePayment = async(req,res)=>{

    // get userId and courseId
    const {course_id} = req.body;
    const UserId = req.user.id;

    // courseId validation
    if(!course_id){
        return res.json({
            success: false,
            message : "Please provide the valide course ID"
        })
    }

    // valid courseDetail
    let course;

    try{
        course = await Course.findById(course_id);

        if(!course){
            return res.json({
                success: false,
                message : "Could not find the course detail"
            })
        }

        // user already pay for the same course 

        const uid = new mongoose.Types.ObjectId(UserId);
        if(course.studentEnrolled.include(uid)){ 
            return res.status(200).json({
                success: false,
                message:"Student is already enrolled"
            })
        }
    }
    catch(error){ 
        console.log(error)
        return res.status(500).json({
            success: false,
            message : error.message,
        }) 
    }

    // order create 

    const amount = course.price;
    const currency = "INR"

    const options = {
        amount : amount * 100,
        currency,
        receipt : Math.random(Date.now()).toString(),
        notes : {
            courseId : course_id,
            userId,
        }

    }


    try{
        // initiate the payment using razorpay 

        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);


        // return response
        return res.status(200).json({
            success : true,
            courseName : course.courseName,
            courseDescription : course.courseDescription,
            thumbnail : course.thumbnail,
            orderId : paymentResponse.id,
            currenct : paymentResponse.currency,
            amount : paymentResponse.amount,
         })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Could not initiate order",

        })
         
    }

}



// verify signature of razorepay and server 

exports.verifySignature = async (req, res)=>{

    const webhookSecret = "12345678";

    const signature = req.headers['x-razorpay-signature'];

    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');


    if(signature === digest){
        console.log("Payment is authorized");


        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try{

            // fulfil the action 

            // find the course and enroll the student in it 
            const enrolledCourse = await Course.findByIdAndUpdate(
                                                {_id : courseId},
                                                {$push : {
                                                    studentEnrolled : userId,
                                                }},
                                                {new : true})


            if(!enrolledCourse){
                return res.status(500).json({
                    success : false,
                    message :"Course not found",
                })
            }

            console.log(enrolledCourse);

            // find the student added the course in the enrolled course list 

            const enrolledStudent = await User.findByIdAndUpdate(
                                                {_id: userId},
                                                {$push : {
                                                    courses : courseId,
                                                }},
                                                {new : true})

            console.log(enrolledStudent);

            // mail send to the student for course enrollment 

            const emailResponse = await mailSender(
                                        enrolledStudent.email,
                                        "Congratulations for Buying course",
                                        "Congratulations, you are enrolled in the out best course, HAPPY  LEARNING" )


            console.log(emailResponse);
            return res.status(200).json({
                success : true,
                message : "Signature verified and course added"
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
    else{
        return res.status(400).json({
            success : false,
            message : "Invalid signature"
        });

    }
}
