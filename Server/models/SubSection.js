const { default: mongoose } = require('mongoose');
const monogoose = require('mongoose');

const subSectionSchema = new monogoose.Schema({

    title:{
        type:String
    },
    
    time_duration:{
        type:String
    },

    description:{
        type:String
    },
    
    videoUrl: {
        type:String
    }

})

module.exports = mongoose.model("SubSection",subSectionSchema)