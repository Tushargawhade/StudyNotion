const jwt = require("jsonwebtoken");
const User  = require('../models/User');
require('dotenv').config();


// optional auth - verifies token if present, otherwise continues as anonymous
exports.authOptional = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = req.cookies.token
      || (req.body && req.body.token)
      || (authHeader && authHeader.replace("Bearer ", ""));

    if (!token) {
      return next();
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    next();
  }
}

// auth 
exports.auth = async(req,res,next)=>{
    try{
        // Extract Token
        const authHeader = req.header("Authorization");
        const token = req.cookies.token
                            || (req.body && req.body.token)
                            || (authHeader && authHeader.replace("Bearer ",""));

        // If token missing then return response 
        if(!token){
                return res.status(401).json({
                    success : false,
                    message : "Token is missing"
                })
        }
        // Verify token 
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
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
exports.isStudent = async(req,res,next)=> {
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
exports.isInstructor = async(req,res,next)=> {
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
exports.isAdmin = async(req,res,next)=> {
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

