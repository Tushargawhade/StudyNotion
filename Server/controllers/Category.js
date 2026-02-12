const Category = require("../models/Category")

// create category handler function  

exports.createCategory = async (req, res) =>{
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
        const categoryDetails = await Category.create({
            name: name,
            description : description,
        })
        console.log(categoryDetails)

        // return response 
        return res.status(200).json({
            success : true,
            message : "Category created successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }

}

// Show All category handler function 

exports.showAllCategory = async (req,res)=>{
    try{

        // find all the category from db and (name and description (true hona chaiye))
        const allCategory = await Category.find({},{name : true, description:true});
        
        // return response 
        return res.status(200).json({
            success: true,
            messsage : "All category return successfully",
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