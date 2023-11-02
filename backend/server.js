const app = require('./app')

const connectDB = require('./config/database');
const dotenv = require('dotenv')

//handle uncaught exception
process.on('uncaughtException',err=>{
    console.log(`ERROR: $(err.message)`);
    console.log('shutting down due to uncaught expception')
    process.exit(1)
})
dotenv.config({path:'backend/config/config.env'})

connectDB();
app.listen(process.env.PORT,()=>{
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})