const SubSection  = require('../models/SubSection');
const Section = require('../models/Section')
const {uploadImageToCloudinary} = ('../utils/imageUploader')

// create Subsection handler function 

exports.createSubsection = async (req, res)=>{


    try{
        // fetch data from req body 
        const {sectionId, tittle, timeDuration, description } = req.body;


        // extract file/video 
        const video = req.files.videoFiles;

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


// H.W updatedSubsection 

// H.W deleteSubsection