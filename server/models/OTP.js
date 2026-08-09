const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const otpTemplate=require('../mail/emailVerificationTemplate');

const otpSchema = new mongoose.Schema({

    email:{
        type:String,    
        required:true
    },

    createdAt:{
        type:Date,
        default: Date.now(),
        expires: 5 * 60,
    },

    otp:{
        type:Number,
        required: true
    }
    
})


// async function to send mail
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email, "Verification mail from StudyVerse",otpTemplate(otp));
        console.log("Email sent Successufully",mailResponse);

    }
    catch(error){
        console.log("Error occure in sending mail",error)
        throw error;
    }

}

otpSchema.pre("save",async function(){
    await sendVerificationEmail(this.email, this.otp)
    
})


module.exports = mongoose.model("OTP",otpSchema)