const { response } = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');

// update profile handler function 

exports.updateProfile = async (req,res)=>{

    try{

        // fetch data 
        const {dateOfBirth="" , gender ,about="", phoneNo} = req.body;

        // get userId 
        const userId = req.user.id;

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

        // validation
        if(!id){
            return res.status(404).json({
                success:false,
                message:"User not found!!"
            })
        }

        // find user details
        const userDetails = await User.findById(id);

        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User does not exist"
            })
        }

        // delete profile
        await Profile.findByIdAndDelete(userDetails.additionalDetails);

        // TODO TASK ----->>> Unenroll user from all enrolled courses

        // delete user
        await User.findByIdAndDelete(id);

        // return response
        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully...."
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User account cannot be deleted",
            error:error.message
        })
    }
}           


// get user handler function 

exports.getAllUserDetails = async(req,res)=>{

    try{
        // get id 
        const userId = req.user.id;

        // get user details 
        const  userDetails = await User.findById(userId).populate("additionalDetails").exec();

        // return response  
        return res.status(200).json({
            success: true,
            message : "User Data fetched successfully....",
            userDetails
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

