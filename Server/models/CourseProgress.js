const { default: mongoose } = require('mongoose');
const monogoose = require('mongoose');

const courseProgessSchema = new monogoose.Schema({

    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },

    completeVideo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",

    },
})

module.exports = mongoose.model("CourseProgress",courseProgessSchema)