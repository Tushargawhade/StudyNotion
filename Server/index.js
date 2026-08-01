const express = require('express');
const app = express();

const courseRouter = require("./routes/Courses");
const profileRouter = require('./routes/Profile');
const userRouter = require('./routes/User');
const contactRouter = require('./routes/Contact');


const {connect} = require('./config/database');
const {cloudinaryConnect} = require('./config/cloudinary');

require('dotenv').config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');


const PORT = process.env.PORT || 4000;

// database connection
connect();

// cloudinary Connection 
cloudinaryConnect();


// middleware  
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin : "http://localhost:3000",
        credentials : true
    })
)

app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : "/tmp"
    })
)


// Routes 
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/contact", contactRouter);



// default Route 
app.get("/", (req,res)=>{
    return res.status(200).json({
        success : true,
        message : "server running successfully on default Route!!"
    })
})
  

// server activate 
app.listen(PORT, ()=>{
    console.log("Server is running on port " + PORT);
})






