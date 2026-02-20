const monogoose = require('mongoose');

const categorySchema = new monogoose.Schema({

    name:{
        type:String,
        required:true
    },

    description:{
        type:String,
        trim:true
    },

    courses:[
        {   
            type: mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
    ],
})

module.exports = mongoose.model("Category",categorySchema)