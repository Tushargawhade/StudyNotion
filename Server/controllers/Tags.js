const Tag = require("../models/Tags")

// create tag handler function  

exports.createTag = async (req, res) =>{
    try{
        // fetch data 
        const {name, description } = req.body;

        // validation 
        if(!name || !description ){
            return res.status(400).json({
                success : false,
                message : "All feilds data required"
            })
        }

        // create entry in db 
        const tagDetails = await Tag.create({
            name: name,
            description : description,
        })
        console.log(tagDetails)

        // return response 
        return res.status(200).json({
            success : true,
            message : "Tag created successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }

}

// Show All tags handler function 

exports.showAllTags = async (req,res)=>{
    try{

        // find all the tags from db and (name and description (true hona chaiye))
        const allTags = await Tag.find({},{name : true, description:true});
        
        // return response 
        return res.status(200).json({
            success: true,
            messsage : "All tags return successfully",
            allTags
        })
        
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }




}