import { app } from './server.js';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Backend running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
});

