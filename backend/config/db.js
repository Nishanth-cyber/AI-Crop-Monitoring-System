const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async ()=>{
    mongoose.connect(`${process.env.mongo_url}aicropprediction`,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("mongoDB connected sucessfully");
    }).catch((err)=>{
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
};

module.exports = connectDB;