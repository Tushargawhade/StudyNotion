const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    firstName:{
        type: String,
        required : true,
        trim:true
    },

    lastName:{
        type: String,
        required : true,
        trim:true
    },

    email:{
        type: String,
        required : true,
    },

    password:{
        type: String,
        required : true,
    },

    accountType:{
        type: String,
        required : true,
        enum:["Admin","Student","Instructor"]
    },

    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },

    courses:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "Course"
    },

    image:{
        type:String,
        required:true,
    },

    cousesprogress:{
        type: monogoose.Schema.Types.ObjectId,
        required:true,
        ref: "CourseProgress"
    },

    contactNumber:{
        type: Number
    },
    otp:{
        type : Number
    }

})

module.exports = mongoose.model("User",userSchema);