import { CustomerService } from '../services/CustomerService.js';

async function createCustomer() {
  const customerService = new CustomerService();

  const newCustomer = {
    name: 'Mats i meningar',
    email: 'lotta.lindberg83@gmail.com',
    urlSlug: 'matsimeningar',  // Detta blir URL:en
    authorizedEmails: ['lotta.lindberg83@gmail.com'],
    settings: {
      allowedAttachmentTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
      maxAttachmentSize: 10 * 1024 * 1024, // 10MB
      autoProcessEmails: true,
      notificationEmail: 'notifikation@email.com'
    }
  };

  try {
    console.log('Skapar ny kund...');
    const customer = await customerService.createCustomer(newCustomer);
    console.log('Kund skapad framgångsrikt!');
    console.log('Kundinformation:');
    console.log('- Namn:', customer.name);
    console.log('- ID:', customer.id);
    console.log('- URL:', `http://localhost:3000/${customer.urlSlug}`);
    console.log('- Tillåtna e-postadresser:', customer.authorizedEmails.join(', '));
    console.log('- Skapad:', customer.createdAt);
  } catch (error) {
    console.error('Fel vid skapande av kund:', error);
  }
}

createCustomer(); 