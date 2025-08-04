import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.config.js';
import Voluntier from './models/user.model.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

// Configure CORS with allowed origins
const allowedOrigins = [
    'http://localhost:3000',
  'https://internship-task-web.vercel.app',
  'https://internship-task2-f4vbuvyb9-marajpatel123s-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server or local tools)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => 
        origin.startsWith(allowedOrigin) || 
        origin.endsWith('.vercel.app')
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Enable if using cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']  // Allowed headers
}));

app.use(express.json());
app.use('/api/users', userRoutes);

// Connect to the database
connectDB();

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
