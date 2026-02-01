const { default: mongoose } = require('mongoose');
const monogoose = require('mongoose');

const tagsSchema = new monogoose.Schema({

    name:{
        type:String,
        required:true
    },

    description:{
        type:String,
        trim:true
    },

    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },

    

})

module.exports = mongoose.model("Tags",tagsSchema)