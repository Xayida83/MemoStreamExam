import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController.ts';
import { AppError } from '../middleware/errorHandler.ts';

const router = Router();
const customerController = new CustomerController();

router.get('/:customerId', async (req, res, next) => {
  try {
    await customerController.getCustomer(req, res);
  } catch (error) {
    next(new AppError(500, 'Failed to get customer'));
  }
});

router.post('/', async (req, res, next) => {
  try {
    await customerController.createCustomer(req, res);
  } catch (error) {
    next(new AppError(500, 'Failed to create customer'));
  }
});

router.put('/:customerId', async (req, res, next) => {
  try {
    await customerController.updateCustomer(req, res);
  } catch (error) {
    next(new AppError(500, 'Failed to update customer'));
  }
});

export const customerRoutes = router; 