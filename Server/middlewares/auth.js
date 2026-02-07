const jwt = require("jsonwebtoken");
const User  = require('../models/User');
require('dotenv').config();




// auth 

exports.auth = async(req,res,next)=>{
    try{

        // Extract Token 
        const token = req.cookies.token
                            || req.body.token 
                            || req.header("Authorization").replace("Bearer ","");

        // If token missing then return response 
        if(!token){
                return res.status(401).json({
                    success : false,
                    message : "Token is missing"
                })
        }

        // Verify token 
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECTER);
            console.log(decode);
            req.user = decode;
        }
        catch(err){
            // Verification issue 
            return res.status(401).json({
                success : false,
                message : "token is invalid"
            })
        }

        next();
    }


    catch(error){
        console.log("Authentication failure...");
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}



// isstudent

exports.isStudent = async(res, req, next)=> {

    try{

        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success : false,
                message : "This is protected route for Student Only.."
            });
        }
        next();
    }
    catch(error){
        console.log("User role can not be verified, please try again!!")
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}



// isinstructor
exports.isInstructor = async(res, req, next)=> {

    try{

        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success : false,
                message : "This is protected route for Instructor Only.."
            });
        }
        next();
    }
    catch(error){
        console.log("User role can not be verified, please try again!!")
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
} 


// isadmin 
exports.isAdmin = async(res, req, next)=> {

    try{

        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success : false,
                message : "This is protected route for Admin Only.."
            });
        }
        next();
    }
    catch(error){
        console.log("User role can not be verified, please try again!!")
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

