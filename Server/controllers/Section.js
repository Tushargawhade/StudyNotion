const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req,res)=>{

    try{
        // data fetch 
        const {sectionName , courseId} = req.body;

        // data validation 
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message : "All fields are required.."
            })
        }

        // create section 
        const newSection  =  await Section.create({sectionName});

        // update course with section object_id 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                                courseId,
                                                {
                                                    $push:{
                                                        courseContent : newSection._id,
                                                    }
                                                },
                                                {new : true}
                                            )

        // Todo task jo karna hai
        // populate to replace section and subsection in updated course 


        // return res 
        return res.status(200).json({
            success: true,
            message : "Section created successfully..",
            updatedCourseDetails
        })
    }
    catch(error){
        console.log("Error occure in section creation")
        return res.status(500).json({
            success: false,
            message : error.message,
        })
    }
}


exports.updateSection = async(req,res)=>{
    try{

        // data input 
        const {sectionName, sectionId} = req.body
 
        // data validation 
        if(!sectionName || !sectionId){
            return res.status(400).json({
                status : false,
                message : "all fields are required"
            })
        }

        // update data 
        const section  = await Section.findByIdAndUpdate(sectionId,
                                                        {sectionName},
                                                        {new :true}  
                                                    )  

        // return res  
        return res.status(200).json({
            success: true,
            message : "Section updated successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : "unable to update the section!!",
            error : error.message
        })
    }
}




exports.deleteSection = async(req,res)=>{
    try{
        // get id assume ki id params ke through send ki  hai 
        const {sectionId } = req.params;

        // use findByIdAndDelete to delete section from db 
        await Section.findByIdAndDelete(sectionId);

        // TODO : ->>> do we need to delete the entry from the course schema 

        // return res 
        return res.status(200).json({
            success: true,
            message : "Section deleted successfully",
        })

    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : "unable to delete the section",
            error : error.message
        })
    }

}