import express from 'express';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './middleware/errorHandler.ts';
import { authRoutes } from './routes/auth.ts';
import { customerRoutes } from './routes/customers.ts';
import { emailRoutes } from './routes/emails.ts';
import { EmailPoller } from './services/EmailPoller.ts';

const app = express();
const emailPoller = new EmailPoller(5 * 60 * 1000); // Poll every 5 minutes

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/emails', emailRoutes);

// Error handling
app.use(errorHandler);

// Start email polling
emailPoller.start().catch(error => {
  console.error('Could not start email polling with existing tokens:', error.message);
  console.log('Please visit http://localhost:5000/api/auth/gmail to authenticate');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 