import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import connectDB from './config/db.config.js'
import Voluntier from './models/user.model.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app= express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes)

//Connect to the database
connectDB();

app.get('/', (req, res)=>{
    res.send('API is running...');
})

app.listen(process.env.PORT || 5000, ()=>{
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
})
