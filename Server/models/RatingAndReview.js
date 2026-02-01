const { default: mongoose } = require('mongoose');
const monogoose = require('mongoose');

const ratingAndreviewSchema = new monogoose.Schema({

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


})

module.exports = mongoose.model("RatingAndReview",ratingAndreviewSchema)