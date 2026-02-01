const { default: mongoose } = require('mongoose');
const monogoose = require('mongoose');

const profileSchema = new monogoose.Schema({

    gender:{
        type:String
    },

    dateOfBirth:{
        type:String
    },

    about:{
        type:String,
        trim:true
    },

    phoneNo:{
        type:Number,
        trim:true
    }

})

module.exports = mongoose.model("Profile",profileSchema)