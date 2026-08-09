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

    whatYouWillLearn:{
        type:String,
        required:true,
        trim:true
    },


    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    }],

    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
    }],

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

    
    tag:{
        type: [String],
        required: true,
    },

    studentsEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    instructions: {
        type : [String]
    },

    status :{ 
        type :String,
        enum : ["Draft", "Published"],
    },

    createdAt:{
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model("Course",courseSchema)
