const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const propertyRoutes = require('./routes/propertyRoute');
const userRoutes = require('./routes/userRoute');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-deployed-frontend.example'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('Backend working!'));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB is connected');
    app.listen(PORT, () => console.log(`Server is running at port: ${PORT}`));
  } catch (err) {
    console.error('Error connecting to MongoDB.', err.message);
    process.exit(1);
  }
};

startServer();
