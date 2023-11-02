const express = require('express');
const app = express();
const errorMiddleware = require('./middelwares/errors');
const cookieParser = require('cookie-parser');
app.use(express.json());// when i request post request the value name,other things not get stored so use this then no error
app.use(cookieParser());
const products = require('./route/products');
const auth = require('./route/auth');

app.use('/api/v1',products);
app.use('/api/v1',auth);


//middleware to handle errors
app.use(errorMiddleware);
module.exports = app;