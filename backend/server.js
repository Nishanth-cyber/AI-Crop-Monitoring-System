const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyparser = require('body-parser');


const app = express();
const port = 5001;

app.use(bodyparser.json());
app.use(cors());

const connectDB = require('./config/db');
connectDB();

const user = require('./Router/userRouter');
const climate = require('./Router/ClimateRouter');
app.use('/user',user);
app.use('/climate',climate)
app.listen(port,()=>{
    console.log(`server is running on http:localhost/${port}`);
})