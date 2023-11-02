const ErrorHandler = require("../utils/errorHandler")
const jwt = require("jsonwebtoken")

const catchAsyncErrors = require('./catchAsyncErrors')
const User = require('../models/user')


exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{

    const {token} = req.cookies
    if(!token){
        return next(new ErrorHandler('Login first to access this resource ',401))
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
     req.user = await User.findById(decoded.id);
     //console.log(req.user);
    //  if (null == req?.user?.role) {
    //     return next(new ErrorHandler(`Bad request`, 400));
    // }
console.log(req.user);
     next();
})
//handling the users roles

exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){
            return next(
            new ErrorHandler(`Role (${req.user.roles}) is not allowed to access this resource`,
            403
            )
            )
        }
        next()
    }
}