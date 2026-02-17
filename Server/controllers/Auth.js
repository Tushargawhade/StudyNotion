const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require('otp-generator');
const bcrpt = require('bcrypt');
const jwt =  require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile");
const {passwordUpdate} = require("../mail/passwordUpdate");
require('dotenv').config();


// send otp fuunction

exports.otp = async (req, res) => {
  try {
    // fetch email from req body
    const { email } = req.body;

    // check if user exist or not
    const checkUserPresent = await User.findOne({ email });

    // if user exist return response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already Registered..",
      });
    }

    // otp generate
    var otp = otpGenerator.generate(6,{
        lowerCaseAlphabets : false,
        upperCaseAlphabets : false,
        specialChars : false
    });
    console.log("otp generated -> ",otp);

    // check otp is unique or not
    const result = await OTP.findOne({otp: otp});

    while(result){

        var otp = otpGenerator.generate(6,{
        lowerCaseAlphabets : false,
        upperCaseAlphabets : false,
        specialChars : false
        });

        const result = await OTP.findOne({otp: otp});
    }


    // otp object created 
    const otpPayload = {email,otp};


    // create opt entry in db 
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody)

    // return successful response  
    res.status(200).json({
        status : true,
        message: "OTP sent successfully.."
    })

  } 
  catch(error){

    console.log(error);
    return res.status(500).json({
        status: false,
        message : error.message
    })


  }
};


// signup function

exports.signup = async (req,res)=>{
    try{

      // data fetch 
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accontType,
        contactNumber,
        otp,
      }   = req.body;


      // validate 
      if(!firstName || !lastName || !email || !password || !confirmPassword || !otp ){
        return res.status(403).json({
          success: false,
          messsage : "All fields are required"
        })
      }

      // match both passwords 
      if(password !== confirmPassword){
        return res.status(400).json({
          success: false,
          messsage : "Password and conform password not match "
        })

      }

      // check user already exist or not 
      const existingUser  =  await  User.findOne({email})
      if(existingUser){
        return res.status(400).json({
          success: false,
          messsage : "User aleady exist"
        })

      }


      // find most recent otp stored for the user
      const recentOtp =  await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
      console.log(recentOtp);
    

      // validate otp 
      if(recentOtp.length == 0){
        return res.status(400).json({
          success: false,
          messsage : "OTP not found "
        })
      } 
      else if(otp !== recentOtp){
        return res.status(400).json({
          success: false,
          messsage : "OTP invalid "
        })

      }


      // hash password
      const hashedPassword = await bcrpt.hash(password,10)
      
      // change 
      // create the user 
      let approved = "";
      approved === "Instructor" ? (approved = false) : (approved = true);


      // enrty create in db 
      const profilDetails = await Profile.create({
        gender: null,
        dateOfBirth : null,
        about : null,
        contactNumber : null
      })

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType: accontType,
        additionalDetails: profilDetails._id,
        contactNumber,
        approved : approved,
        image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
      })


      // return res
      return res.status(200).json({
        success:true,
        message: "User Registerd Successfully .... ",
        user
      })

    }
    catch(error){
      console.log("Something went wrong in signUp")

      return res.status(500).json({
        success: false,
        message : "User can not Registerd Successfully Try again!! "
      })
    }
}


// login

exports.login = async (req,res) =>{
    try{

      // fetchin email and password 
      const {email, password} = req.body;

      //validation of data  
      if(!email || !password){
        return res.status(403).json({
          success: false,
          message : "All fields are required"
        })
      }

      //check if user present or not 
      const user = await User.findOne({email});

      //if not present return response email not registered
      if(!user){
        return res.status(401).json({
          success: false,
          message : "User is not registerd Please SignUp"
        })

      }


      //if yes verify password  and generate jwt token 
      if(await bcrpt.compare(password , user.password)){
        
        const payload = {
          email : user.email,
          id : user._id,
          accountType  : user.accountType
        }

        const token = jwt.sign(payload ,  process.env.JWT_SECTER,{
          expiresIn : "2h",
        });


        user.token = token ;
        user.password = undefined;

        //return respone and  cookies
        const options  = {
           expires : new Date(Date.now() + 3* 24 *60*60 *1000),
           httpOnly : true
        }


        res.cookies("token",token,options).json({
          success : false,
          token,
          user,
          message : "User Loggin Successfully"
        })

      }
      else{
        return res.status(401).json({
          success : false,
          message: "Password in not correct"
        })
      }

    }
    catch(error){
      console.log("Error occure on login");

      return res.status(500).json({
        success: false,
        message : error.message
      })
    }
}


