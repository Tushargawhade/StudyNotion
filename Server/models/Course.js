const mongoose = require('mongoose');
// const Category = require('./Category');

const courseSchema = new mongoose.Schema({

    courseName:{
        type:String,
        required: true
    },

    courseDescription:{
        type:String,
        required: true
    },

    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }, 

    whatWillYouLearn:{
        type:String,
        required:true,
        trim:true
    },


    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    }],

    ratingAndreview:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
    },

    price:{
        type:Number
    },

    thumbnail:{
        type:String
    },

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },

    
    tags:{
        type: [String],
        required: true,
    },

    studentEnrolled:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },

    instructions: {
        type : [String]
    },

    status :{ 
        type :String,
        enum : ["Draft", "Published"],
    },
})

module.exports = mongoose.model("Course",courseSchema)