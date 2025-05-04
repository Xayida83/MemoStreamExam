import { CustomerService } from '../services/CustomerService.js';

async function checkCustomer() {
  const customerService = new CustomerService();
  
  try {
    const customer = await customerService.getCustomerBySlug('matsimeningar');
    if (customer) {
      console.log('Kund hittad:', {
        namn: customer.name,
        tillåtnaEposter: customer.authorizedEmails
      });
    } else {
      console.log('Ingen kund hittad med URL-slug "matsimeningar"');
    }
  } catch (error) {
    console.error('Fel vid sökning av kund:', error);
  }
}

checkCustomer(); 