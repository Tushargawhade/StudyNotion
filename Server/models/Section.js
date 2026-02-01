const { default: mongoose } = require('mongoose');
const monogoose = require('mongoose');

const sectionSchema = new monogoose.Schema({

    sectionName:{
        type:String
    },

    subSection:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "SubSection"
    },

})

module.exports = mongoose.model("Section",sectionSchema)