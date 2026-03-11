const mongoose = require('mongoose');

const ratingAndreviewSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    rating:{
        type:Number,
        required:true
    },

    review:{
         type:String,
         trim:true
    },
    course:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course",
        required : true,
        index : true,
    }
    
})

module.exports = mongoose.model("RatingAndReview",ratingAndreviewSchema)