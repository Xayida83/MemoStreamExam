import { Request, Response } from 'express';
import { CustomerService } from '../services/CustomerService.js';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  async getCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const { customerId } = req.params;

      if (!customerId) {
        return res.status(400).json({
          error: 'Customer ID is required',
          code: 'MISSING_CUSTOMER_ID'
        });
      }

      const customer = await this.customerService.getCustomerById(customerId);
      
      if (!customer) {
        return res.status(404).json({
          error: 'Customer not found',
          code: 'CUSTOMER_NOT_FOUND'
        });
      }

      return res.json(customer);
    } catch (error: any) {
      console.error('Error getting customer:', error);
      return res.status(500).json({
        error: 'Failed to get customer',
        code: 'INTERNAL_SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async createCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const customerData = req.body;

      const customer = await this.customerService.createCustomer(customerData);
      return res.status(201).json(customer);
    } catch (error: any) {
      console.error('Error creating customer:', error);
      return res.status(500).json({
        error: 'Failed to create customer',
        code: 'INTERNAL_SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async updateCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const { customerId } = req.params;
      const customerData = req.body;

      if (!customerId) {
        return res.status(400).json({
          error: 'Customer ID is required',
          code: 'MISSING_CUSTOMER_ID'
        });
      }

      await this.customerService.updateCustomer(customerId, customerData);
      return res.status(200).json({ message: 'Customer updated successfully' });
    } catch (error: any) {
      console.error('Error updating customer:', error);
      return res.status(500).json({
        error: 'Failed to update customer',
        code: 'INTERNAL_SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
} 