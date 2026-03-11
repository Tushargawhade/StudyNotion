const SubSection  = require('../models/SubSection');
const Section = require('../models/Section')
const {uploadImageToCloudinary} = require('../utils/imageUploader')
require('dotenv').config();

const FOLDER_NAME = process.env.FOLDER_NAME;

// create Subsection handler function 
exports.createSubsection = async (req, res)=>{


    try{
        // fetch data from req body 
        const {sectionId, tittle, timeDuration, description } = req.body;


        // extract file/video 
        const video = req.files.video;

        // validation  
        if(!sectionId || !tittle || !timeDuration || !description || !video){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        // upload video to cloudinary 
        const uploadDetails =  await uploadImageToCloudinary(video, FOLDER_NAME);



        // create sub-section 
        const subSectionDetails = await SubSection.create({
            tittle : tittle,
            timeDuration : timeDuration,
            description : description,
            videoUrl : uploadDetails.secure_url,
        })

        // update section with the sub section object id 
        const updateSection = await Section.findByIdAndUpdate(sectionId,
                                                            {
                                                                $push:{
                                                                    subSection :subSectionDetails._id,
                                                                }
                                                            },
                                                            {new:true}
                                                        )

        // Todo --->>> log updated section here after adding populate query 
                                                        
         
        // return res 
        return res.status(200).json({
            success: true,
            message : "SubSection created successfully..",
            updateSection
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message : "Error in creation of subsection",
            error : error.message
        })
    }

}


// Handler function for updatedSubsection 
exports.updateSubSection = async (req,res)=>{
    try{
        // fetch data
        const { SubSectionId, title, description, timeDuration } = req.body;

        // extract file/video 
        // const video = req.files.video;

        // validation
        if(!SubSectionId || !title || !description || !timeDuration){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        // update subsection
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            SubSectionId,
            {
                title,
                description,
                timeDuration
            },
            { new:true }
        )

        // return response
        return res.status(200).json({
            success:true,
            message:"SubSection updated successfully",
            updatedSubSection
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update subsection",
            error:error.message
        })
    }
}



// Handler function for deleteSubsection
exports.deleteSubSection = async (req,res)=>{
    try{

        // fetch data
        const { subSectionId, sectionId } = req.body;

        // validation
        if(!subSectionId || !sectionId){
            return res.status(400).json({
                success:false,
                message:"subSectionId and sectionId are required"
            })
        }

        // check subsection exists
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"SubSection not found"
            })
        }

        // delete subsection
        await SubSection.findByIdAndDelete(subSectionId);

        // remove subsection from section
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                $pull:{
                    subSection:subSectionId
                }
            },
            { new:true }
        ).populate("subSection");

        // return response
        return res.status(200).json({
            success:true,
            message:"SubSection deleted successfully",
            updatedSection
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete subsection",
            error:error.message
        })
    }
}