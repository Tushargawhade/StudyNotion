const User = require('../models/User')
const mailSender = require('../utils/mailSender')
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";


// resetpasswordToken 

exports.resetPasswordToken  = async (req, res)=>{

    try{
    // get mail from user body 
    const email = req.body.email;

    // check user for this mail, email validation 
    const user = await User.findOne({email: email})
    if(!user){
        return res.json({
            success: false,
            message : "your email is not registerd with us"
        })
    }
    // generate token 
    const token = crypto.randomUUID();


    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
                                {email: email},
                                {token : token,
                                 resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
                                {new: true})


    // create url 
    const url =  `${CLIENT_URL}/update-password?token=${token}`


    // send mail containg url
    await mailSender(email,"Password Reset link", `Password Reset Link: ${url}`)



    // return response 
    return res.status(200).json({
        success: true,
        message: "Email sent successfully, please check mail and change password "
    })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Something went in wrong while sending reset password"
        })

    }
}

// resetpassword 

exports.resetPassword = async(req,res)=>{
    try{

        // data fetch 
        const {password, confirmPassword, token } = req.body;

        // validation 
        if(password !== confirmPassword){
            return res.json({
                success : false,
                message : "Password not matching!!"
            })
        }

        // get userdetails from db using token
        const userDetails = await User.findOne({token: token}) 

        // if no enter -  invalid token 
        if(!userDetails){
            return res.json({
                success : false,
                message : "Token is invalid",
            })
        }

        // token time check 
        if(userDetails.resetPasswordExpires < Date.now() ){
            return res.json({
                success : false,
                message : "Token is expired, please regenerate your token"
            })
        }

        // hash password 
        const hashedPassword = await bcrypt.hash(password , 10);


        // password update 
        await User.findOneAndUpdate(
                    {token : token},
                    {password : hashedPassword,
                     token : undefined,
                     resetPasswordExpires : undefined},
                    {new : true}
                )

        // return response 
        return res.status(200).json({
            success: true,
            message : "Password reset Successful"

        })
    }
     catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Something went in wrong while sending pwd mail"
        })

    }
} 
