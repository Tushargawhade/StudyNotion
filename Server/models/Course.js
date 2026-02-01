const { default: mongoose } = require('mongoose');
const monogoose = require('mongoose');

const courseSchema = new monogoose.Schema({

    name:{
        type:String,
        required: true
    },

    description:{
        type:String,
        required: true
    },

    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    whatWillLearn:{
        type:String,
        required:true,
        trim:true
    },


    courseContent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    },

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

    tags:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tags"
    },

    studentEnrolled:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    }

})

module.exports = mongoose.model("Course",courseSchema)