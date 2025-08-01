const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const propertyRoutes = require('./routes/propertyRoute');
const userRoutes = require('./routes/userRoute');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req,res) =>{
    console.log("Backend working!");
});

const startServer = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB is connected');

        app.listen(PORT, () =>{
            console.log(`server is running at port: ${PORT}`);
        });
    }
    catch (err){
       console.error('Error connecting to MongoDB.', err.message);
       process.exit(1);
    }
}


startServer();