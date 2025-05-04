import { Router } from 'express';
import { EmailController } from '../controllers/EmailController.ts';
import { EmailPoller } from '../services/EmailPoller.ts';
import { AppError } from '../middleware/errorHandler.ts';

const router = Router();
const emailController = new EmailController();
const emailPoller = new EmailPoller(5 * 60 * 1000);

router.get('/:customerId', async (req, res, next) => {
  try {
    await emailController.getCustomerEmails(req, res);
  } catch (error) {
    next(new AppError(500, 'Failed to get customer emails'));
  }
});

router.post('/:customerId/process/:emailId', async (req, res, next) => {
  try {
    await emailController.processEmail(req, res);
  } catch (error) {
    next(new AppError(500, 'Failed to process email'));
  }
});

router.post('/poll', async (req, res, next) => {
  try {
    await emailPoller.pollEmails();
    res.json({ message: 'Polling triggered successfully' });
  } catch (error) {
    next(new AppError(500, 'Failed to trigger email polling'));
  }
});

export const emailRoutes = router; 