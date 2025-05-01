import { CustomerService } from '../services/CustomerService.js';

async function checkCustomer() {
  const customerService = new CustomerService();
  
  try {
    const customer = await customerService.getCustomerByNumber('789');
    if (customer) {
      console.log('Kund hittad:', {
        namn: customer.name,
        tillåtnaEposter: customer.authorizedEmails
      });
    } else {
      console.log('Ingen kund hittad med nummer 789');
    }
  } catch (error) {
    console.error('Fel vid sökning av kund:', error);
  }
}

checkCustomer(); 