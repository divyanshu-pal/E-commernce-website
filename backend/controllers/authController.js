const User  = require('../models/user')
const sendToken = require('../utils/jwttoken');
const ErrorHandler = require('../utils/errorHandler')
const sendEmail = require('../utils/sendEmail')
 const catchAsyncErrors = require('../middelwares/catchAsyncErrors');
const crypto = require('crypto');

//Register a user => /api/v1/register

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
     
          
        const{name,email,password} = req.body;
       
        const user = await User.create({
            name,
            email,
            password,
            avatar:{
                public_id:'samples/man-on-a-street',
                url:'https://res.cloudinary.com/dhwkcdkym/image/upload/v1691062728/samples/man-on-a-street.jpg'
                  }
            })

        //    console.log(user);
        // const token = user.getJwtToken();
        // res.status(201).json({
        //     success:true,
        //     token
        // })
        
        sendToken(user,200,res);
     
       
          
       
    //  }catch(error){
      
    //          res.status(404).json({
    //             error
                
    //          })
    //          return next(new ErrorHandler(error.message,500));
            
    // }
})


//  Login user => /api/v1/login


exports.loginUser = async(req,res,next)=>{
    const {email,password} = req.body;

    //checks if email and password is entered by user
    if(!email|| !password){
        return next(new ErrorHandler('Please enter email & password',400));
    }
    
    //Finding user in database 
    const user =await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorHandler('Invalid Email or password',401))

    }

    //check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    
    if(!isPasswordMatched)
    {
        return next(new ErrorHandler('Invalid Email or Password',401));
    }

    
    // const token = user.getJwtToken();
    // res.status(201).json({
    //     success:true,
    //     token
    // })
    sendToken(user,200,res);

}

// get  currently logged in user details => /api/v1/me

exports.getUserProfile = catchAsyncErrors(async(req,res,next)=>{
     const user = await User.findById(req.user.id);// form authuncitcated req.user

     res.status(200).json({
        success:true,
        user
     })
})

// update/changepassword=> /api/v1/password/update for current login user
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');

    //check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('old password is incorrect',400))

    }

    user.password= req.body.password;
    await user.save();
    sendToken(user,200,res)
})

//update usre profile  => /api/v1/update

exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }

    //updae avtar:Todo
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })
})


//forgot password =>/api/v1/password/forgot

exports.forgotPassword = async(req,res,next)=>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHandler('User not found with this email',404));
    }
    //get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});
    // create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email , then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'shopit password recovery',
            message
        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        console.log(error);
        console.log(error.message);
        return next(new ErrorHandler(error.message,500));
        
    }
    
}

//reset password => /api/v1/password/reset/:token
exports.resetPassword = async(req,res,next)=>{
        
    // hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()}
        
    })

    if(!user){
        return next(new ErrorHandler('passwor token is invaid or has been expired',400));

    }

    if(req.body.password !== req.body.confirmPassword)
    {
        return next(new ErrorHandler('password does not match',400));
    }

    //setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user,200,res);
}


exports.logoutUser = async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}

//admin routes

//get all users =>/api/v1/admin/users

exports.allUsers = catchAsyncErrors(async(req,res,next)=>{
   
     const users = await User.find();
    res.status(200).json({
         success:true,
         users
    })
})


//get user details =>/api/v1/admin/user/:id

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`user does not found with id ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user

    })
})


//update usre profile  => /api/v1/admin/user/:id

exports.updateUser = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

   
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })
})
