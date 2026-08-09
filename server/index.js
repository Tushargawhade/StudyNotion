const express = require('express');
const os = require('os');
const app = express();

app.set('trust proxy', 1);

const courseRouter = require("./routes/Courses");
const profileRouter = require('./routes/Profile');
const userRouter = require('./routes/User');
const contactRouter = require('./routes/Contact');
const wishlistRouter = require('./routes/Wishlist');
const adminRouter = require('./routes/Admin');


const {connect} = require('./config/database');
const {cloudinaryConnect} = require('./config/cloudinary');

require('dotenv').config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');


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
        origin : process.env.CLIENT_URL || "http://localhost:3000",
        credentials : true
    })
)

app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : os.tmpdir()
    })
)

// rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use("/api/v1/auth/sendotp", authLimiter);
app.use("/api/v1/auth/login", authLimiter);


// Routes 
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/admin", adminRouter);



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






