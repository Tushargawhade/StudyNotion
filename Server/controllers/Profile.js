const { response } = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');

// update profile handler function 

exports.updateProfile = async (req,res)=>{

    try{

        // fetch data 
        const {dateOfBirth="" , gender ,about="", phoneNo} = req.body;

        // get userId 
        const userId  = req.body.id;

        // validation 
        if(!gender || !phoneNo || !userId){
            return res.status(400).json({
                success : false,
                message : "All fields are required",
            })
        }

        // find Profile 
        const userDetails = await User.findById(userId);
        const profileId = await userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);


        // Update profile 
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender; 
        profileDetails.about = about;
        profileDetails.phoneNo = phoneNo;
        await profileDetails.save();



        // return res 
        return res.status(200).json({
            success: true,
            messsage: "Profile Updated Successfully",
            profileDetails
        })



    }
    catch(error){
        console.log(error);
        return  res.status(500).json({
            success: false,
            message : error.message

        })
    }
}


// detele account handler function  

// TODO TASK ---->> Explore how can we schedule this deletion operation time ke hissab se 


exports.deleteAccount = async(req,res)=>{
    try{

        // fetch id 
        const id = req.body.id;

        // validate 
        if(!id){
            return res.status(404).json({
                success :false,
                message :"User not found!!"
            })
        }

        // delete profile from user 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        // TODO TASK ----->>> Unenrolled User form all the enrolled course 

        // delete user 
        await User.findByIdAndDelete({_id:id});

        // return res 
        return res.status(200).json({
            success :true,
            message : "User Deleted Successully...."
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message : "user can not deleted account successfully",
            error : error.message 
        })
    }
}


// get user handler function 

exports.getAllUserDetails = async(req,res)=>{

    try{
        // get id 
        const id = req.body.id;

        // get user details 
        const  userDetails = await User.findById(id).populate("additionalDetails").exec();


        // return response  
        return res.status(200).json({
            success: true,
            message : "User Data fetched successfully...."
        })
    }
    catch(error){
        return res.status(500).json({
            success :false,
            message : "Error found in fetching user!!",
            error : error.message
        })
    }
}

