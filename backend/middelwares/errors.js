const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    //err.message  = err.message|| 'Internal Server error';

    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errMessage:err.message,
            stack:err.stack
        })
    }

    if(process.env.NODE.ENV === 'PRODUCTION'){
        let error = {...err}
        error.message = err.message

        //wrong mongoose object id error
        if(err.name === 'CastError'){
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message,400);
        }

        //handling mongoose validation error
        if(err.name === 'ValidationError')
        {
            const message = object.values(err.errors).map(value =>value.message);
            error = new ErrorHandler(message,400);

        }

                
        //handling the mongoose duplicate key error
        if(err.code === 11000){
            const message = `Duplicate ${object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message,400); 
        }
        
        //handling wrong jwt error
        if(err.code ==='JsonWebTokenError'){
            const message = 'JSON web token is invalid try again'
            error = new ErrorHandler(message,400); 
        }

          //handling expire jwt error
        if(err.code ==='TokenExpiredError'){
            const message = 'JSON web token is Expired'
            error = new ErrorHandler(message,400); 
        }


        res.status(err.statusCode).json({
            success:false,
            message:error.message||'Internal server Error'
        })


    }
    


    // res.status(err.statusCode).json({
    //     success:false,
    //     error:err.stack
    // })
}