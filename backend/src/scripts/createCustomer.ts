import { CustomerService } from '../services/CustomerService.js';

async function createCustomer() {
  const customerService = new CustomerService();

  // Exempel på hur du kan skapa en ny kund
  const newCustomer = {
    name: 'Lotta Tänker', // Kundens namn
    authorizedEmails: ['lindberg.lotta.rebecka@gmail.com'], // Tillåtna e-postadresser som kan skicka e-post
    settings: {
      allowedAttachmentTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
      maxAttachmentSize: 10 * 1024 * 1024, // 10MB
      autoProcessEmails: true,
      notificationEmail: 'notifikation@email.com' // Valfritt: E-post för notifieringar
    }
  };

  try {
    console.log('Skapar ny kund...');
    const customer = await customerService.createCustomer(newCustomer);
    console.log('Kund skapad framgångsrikt!');
    console.log('Kundinformation:');
    console.log('- Namn:', customer.name);
    console.log('- ID:', customer.id);
    console.log('- Tillåtna e-postadresser:', customer.authorizedEmails.join(', '));
    console.log('- Skapad:', customer.createdAt);
  } catch (error) {
    console.error('Fel vid skapande av kund:', error);
  }
}

createCustomer(); 